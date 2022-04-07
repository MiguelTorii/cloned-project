/* eslint-disable no-empty */
import React, { useCallback, useState, useEffect } from 'react';

import { push as routePush } from 'connected-react-router';
import parse from 'html-react-parser';
import debounce from 'lodash/debounce';
import { connect, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import { truncate } from 'utils/helpers';

import * as chatActions from 'actions/chat';
import { setCurrentCommunityIdAction, setCurrentChannelSidAction } from 'actions/chat';
import { enqueueSnackbar, closeSnackbar } from 'actions/notifications';
import * as OnboardingActions from 'actions/onboarding';
import { updateTitle } from 'actions/web-notifications';
import { logEvent } from 'api/analytics';
import { useChatClient } from 'features/chat';
import usePrevious from 'hooks/usePrevious';
import { selectChannelList, selectUnread } from 'redux/chat/selectors';
import { useAppSelector } from 'redux/store';
import withRoot from 'withRoot';

import type { ChatState } from 'reducers/chat';
import type { UserState } from 'reducers/user';
import type { State as StoreState } from 'types/state';

const MESSAGE_CONTENT_CHARACTER_LIMIT = 50;

const styles = (theme) => ({
  root: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'flex-end'
  },
  noMessages: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: theme.spacing(2)
  },
  info: {
    backgroundColor: 'red'
  },
  snackbar: {
    backgroundColor: theme.circleIn.palette.snackbar,
    color: theme.circleIn.palette.primaryText1
  },
  loading: {
    width: '100%',
    marginTop: theme.spacing(2),
    textAlign: 'center'
  }
});

type Props = {
  classes?: Record<string, any>;
  user?: UserState;
  chat?: ChatState;
  router?: any;
  handleRemoveChannel?: (...args: Array<any>) => any;
  handleRoomClick?: (...args: Array<any>) => any;
  updateOpenChannels?: (...args: Array<any>) => any;
  handleChannelClose?: (...args: Array<any>) => any;
  enqueueSnackbarAction: (...args: Array<any>) => any;
  closeSnackbarAction: (...args: Array<any>) => any;
  setCurrentCommunityId?: (...args: Array<any>) => any;
  updateTitleAction?: (...args: Array<any>) => any;
  handleMuteChannel?: (...args: Array<any>) => any;
  handleNewChannel?: (...args: Array<any>) => any;
  push?: (...args: Array<any>) => any;
  onboardingListVisible?: boolean;
  getOnboardingList?: (...args: Array<any>) => any;
  setCurrentCommunityChannel?: (...args: Array<any>) => any;
};

const FloatingChat = ({
  classes,
  user,
  chat,
  push,
  router,
  handleRemoveChannel,
  handleRoomClick,
  handleMuteChannel,
  updateOpenChannels,
  handleChannelClose,
  setCurrentCommunityId,
  handleNewChannel,
  enqueueSnackbarAction,
  closeSnackbarAction,
  updateTitleAction,
  onboardingListVisible,
  getOnboardingList,
  setCurrentCommunityChannel
}: Props) => {
  const dispatch = useDispatch();

  const [createChannel, setCreateChat] = useState(null);

  const {
    data: {
      uuid,
      newMessage,
      online,
      local,
      openChannels,
      currentChannel,
      currentCommunityChannel,
      currentCommunityId
    }
  } = chat;
  const {
    location: { pathname }
  } = router;

  const client = useChatClient();

  const showNotification = useCallback(
    (channel) => {
      if (!pathname.includes('chat')) {
        return false;
      }

      if (currentCommunityId === 'chat' || !currentCommunityId) {
        return currentChannel?.sid === channel.sid;
      }

      return currentCommunityChannel?.sid === channel.sid;
    },
    [currentCommunityId, currentChannel, currentCommunityChannel, pathname]
  );
  const {
    data: { userId, profileImage }
  } = user;
  const handleNewChannelClose = useCallback(() => {
    handleNewChannel?.(false);
  }, [handleNewChannel]);

  const handleOpenChannel = (channel) => {
    // Use `any` type because `Property 'channelState' is private and only accessible within class 'Channel'.`
    const {
      channel: {
        channelState: { attributes }
      }
    } = newMessage as any;

    if (attributes?.community_id) {
      dispatch(setCurrentCommunityIdAction(attributes?.community_id));
    } else {
      dispatch(setCurrentCommunityIdAction(null));
    }

    dispatch(setCurrentChannelSidAction(channel.sid));
    push('/chat');
  };

  const handleMessageReceived = (channel) => (key) =>
    (
      <>
        <Button
          onClick={() => {
            handleOpenChannel(channel);
          }}
        >
          Open
        </Button>
        <Button
          onClick={() => {
            closeSnackbarAction(key);
          }}
        >
          Dismiss
        </Button>
      </>
    );

  const notificationMessageWithoutBody = (files, fullName) => {
    let content = '';

    if (files?.length === 1) {
      content = `${fullName} shared ${files[0].fileName}`;
    }

    if (files?.length > 1) {
      content = `${fullName} shared multiple files`;
    }

    return content;
  };

  const unread = useAppSelector(selectUnread);

  const [prevMessageId, setPrevMessageId] = useState('');
  useEffect(() => {
    const handleMessage = () => {
      // Use `any` type because `Property 'state' is private and only accessible within class 'Message'.`
      const { state, channel } = newMessage as any;
      const { author, attributes, body } = state;
      const { firstName, lastName, files } = attributes;
      const sids = openChannels.map((oc) => oc.sid);
      setPrevMessageId(newMessage.sid);

      if (
        Number(author) !== Number(userId) &&
        !showNotification(channel) &&
        !sids.includes(channel.sid) &&
        !local[channel.sid].muted
      ) {
        const msg = `${firstName} ${lastName} sent you a message:`;
        let fullMessageContent = '';

        if (typeof parse(body) === 'string') {
          if (!body) {
            fullMessageContent = notificationMessageWithoutBody(files, `${firstName} ${lastName}`);
          } else {
            fullMessageContent = body;
          }
        } else if (!body.length) {
          fullMessageContent = notificationMessageWithoutBody(files, `${firstName} ${lastName}`);
        } else {
          // TODO add unit tests for regex.
          fullMessageContent = body.replace(/(<([^>]+)>)/gi, '');
        }

        const messageContent = truncate(fullMessageContent, MESSAGE_CONTENT_CHARACTER_LIMIT);
        enqueueSnackbarAction({
          notification: {
            message: `${msg} ${messageContent}`,
            options: {
              variant: 'info',
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
              },
              action: handleMessageReceived(channel),
              autoHideDuration: 3000,
              ContentProps: {
                classes: {
                  root: classes.snackbarStyle
                }
              }
            }
          }
        });
        updateTitleAction({
          title: `${firstName} ${lastName} sent you a message:`,
          body: messageContent
        });
      }
    };

    if (newMessage && prevMessageId !== newMessage.sid) {
      handleMessage();
    } // eslint-disable-next-line
  }, [newMessage, local, prevMessageId]);
  useEffect(() => {
    handleNewChannelClose();
    const updateOpenChannelsDebounce = debounce(updateOpenChannels, 250);
    window.addEventListener('resize', updateOpenChannelsDebounce);
    return () => {
      window.removeEventListener('resize', updateOpenChannelsDebounce);

      if (
        updateOpenChannelsDebounce.cancel &&
        typeof updateOpenChannelsDebounce.cancel === 'function'
      ) {
        updateOpenChannelsDebounce.cancel();
      }
    };
  }, [handleNewChannelClose, updateOpenChannels]);
  const prevChat = usePrevious(chat);

  const handleCreateChannelOpen = (type) => {
    setCreateChat(type);
  };

  useEffect(() => {
    if (prevChat && pathname !== '/chat') {
      const {
        data: { uuid: prevUuid }
      } = prevChat;

      if (uuid !== prevUuid && uuid !== '') {
        handleCreateChannelOpen('group');
      }

      if (client && profileImage !== '') {
        try {
          if ((client.user.attributes as Record<string, any>).profileImageUrl !== profileImage) {
            client.user.updateAttributes({
              ...client.user.attributes,
              profileImageUrl: profileImage
            });
          }
        } catch (err) {}
      }
    } // eslint-disable-next-line
  }, [user, chat, online]);

  // TODO: Since it returns null now, we need to move the used logic into hook or somewhere and remove this component.
  return null;
};

const mapStateToProps = ({ router, user, chat, onboarding }: StoreState): {} => ({
  user,
  router,
  chat,
  onboardingListVisible: onboarding.onboardingList.visible
});

const mapDispatchToProps = (dispatch: any): {} =>
  bindActionCreators(
    {
      push: routePush,
      handleMuteChannel: chatActions.handleMuteChannel,
      handleRemoveChannel: chatActions.handleRemoveChannel,
      handleRoomClick: chatActions.handleRoomClick,
      updateOpenChannels: chatActions.updateOpenChannels,
      handleChannelClose: chatActions.handleChannelClose,
      handleNewChannel: chatActions.handleNewChannel,
      updateTitleAction: updateTitle,
      enqueueSnackbarAction: enqueueSnackbar,
      closeSnackbarAction: closeSnackbar,
      setCurrentCommunityId: chatActions.setCurrentCommunityId,
      getOnboardingList: OnboardingActions.getOnboardingList,
      setCurrentCommunityChannel: chatActions.setCurrentCommunityChannel
    },
    dispatch
  );

export default connect<{}, {}, Props>(
  mapStateToProps,
  mapDispatchToProps
)(withRoot(withStyles(styles as any)(FloatingChat)));
