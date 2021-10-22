/* eslint-disable no-nested-ternary */
import React, { useMemo, useCallback, useEffect, useState } from 'react';
import cx from 'classnames';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Grid from '@material-ui/core/Grid';
import withWidth from '@material-ui/core/withWidth';
import IconButton from '@material-ui/core/IconButton';
import IconLeft from '@material-ui/icons/ArrowBack';
import IconRight from '@material-ui/icons/ArrowForward';
import * as OnboardingActions from '../../actions/onboarding';
import * as chatActions from '../../actions/chat';
import LeftMenu from './LeftMenu';
import RightMenu from './RightMenu';
import Main from './Main';
import * as notificationsActions from '../../actions/notifications';
import type { UserState } from '../../reducers/user';
import type { ChatState } from '../../reducers/chat';
import { blockUser } from '../../api/user';
import type { State as StoreState } from '../../types/state';
import useStyles from './_styles/directChat';

type Props = {
  chat?: ChatState;
  user?: UserState;
  width?: string;
  onboardingListVisible?: boolean;
  setMainMessage?: () => void;
  handleRemoveChannel?: (...args: Array<any>) => any;
  handleBlockUser?: (...args: Array<any>) => any;
  handleMuteChannel?: (...args: Array<any>) => any;
  handleNewChannel?: (...args: Array<any>) => any;
  setCurrentChannelSid?: (...args: Array<any>) => any;
  setOneTouchSend?: (...args: Array<any>) => any;
  handleUpdateFriendlyName?: (...args: Array<any>) => any;
  handleMarkAsRead?: (...args: Array<any>) => any;
  enqueueSnackbar?: (...args: Array<any>) => any;
  startMessageLoading?: (...args: Array<any>) => any;
  getOnboardingList?: (...args: Array<any>) => any;
  setCurrentChannel?: (...args: Array<any>) => any;
};

const DirectChat = ({
  handleRemoveChannel,
  handleBlockUser,
  handleMuteChannel,
  setCurrentChannelSid,
  handleNewChannel,
  handleUpdateFriendlyName,
  setOneTouchSend,
  handleMarkAsRead,
  startMessageLoading,
  enqueueSnackbar,
  setCurrentChannel,
  width,
  chat,
  user,
  setMainMessage,
  getOnboardingList,
  onboardingListVisible
}: Props) => {
  const {
    isLoading,
    data: {
      client,
      channels,
      newMessage,
      selectedChannelId,
      local,
      newChannel,
      mainMessage,
      currentChannel,
      oneTouchSendOpen,
      messageLoading
    }
  } = chat;
  const classes: any = useStyles();
  const {
    data: { userId, schoolId, permission }
  } = user;
  const [leftSpace, setLeftSpace] = useState(2);
  const [rightSpace, setRightSpace] = useState(0);
  const [prevWidth, setPrevWidth] = useState(null);
  const [channelList, setChannelList] = useState([]);
  const [lastReadMessageInfo, setLastReadMessageInfo] = useState<{
    channelId: string;
    lastIndex: number;
  }>({
    channelId: null,
    lastIndex: null
  });

  const lastChannelSid = useMemo(() => localStorage.getItem('currentDMChannel'), []);
  const currentChannelId = useMemo(
    () => selectedChannelId || lastChannelSid || channelList[0],
    [selectedChannelId, lastChannelSid, channelList]
  );
  const onNewChannel = useCallback(() => {
    handleNewChannel(true);
  }, [handleNewChannel]);
  const handleOpenRightPanel = useCallback(() => {
    if (['xs'].includes(width)) {
      setRightSpace(0);
    } else if (!rightSpace) {
      setRightSpace(3);
    } else {
      setRightSpace(0);
    }
  }, [rightSpace, width]);
  const clearCurrentChannel = useCallback(() => setCurrentChannel(null), [setCurrentChannel]);
  const onOpenChannel = useCallback(
    ({ channel }) => {
      if (['xs'].includes(width)) {
        setLeftSpace(0);
      }

      if (newChannel) {
        handleNewChannel(false);
      }

      setCurrentChannelSid(channel.sid);
      setCurrentChannel(channel);
    },
    [handleNewChannel, setCurrentChannel, setCurrentChannelSid, width, newChannel]
  );
  const handleRemove = useCallback(
    async (sid) => {
      const restChannels = channelList.filter((channel) => channel !== sid.sid);

      if (currentChannel.sid === sid.sid) {
        await setCurrentChannelSid(restChannels[0]);
        await setCurrentChannel(
          local[restChannels[0]] ? local[restChannels[0]].twilioChannel : null
        );
      }

      await handleRemoveChannel(sid);
    },
    [
      handleRemoveChannel,
      currentChannel,
      setCurrentChannel,
      clearCurrentChannel,
      channelList,
      local
    ]
  );
  const updateGroupName = useCallback(
    async (channel) => {
      setCurrentChannel(channel);
      await handleUpdateFriendlyName(channel);
    },
    [handleUpdateFriendlyName, setCurrentChannel]
  );
  const curSize = useMemo(
    () => (width === 'xs' ? 12 : ['md', 'sm'].includes(width) ? 4 : 3),
    [width]
  );
  useEffect(() => {
    const channelList = Object.keys(local)
      .filter(
        (l) => local[l]?.sid && !local[l]?.twilioChannel?.channelState?.attributes?.community_id
      )
      .sort((a, b) => {
        if (local[a].lastMessage.message === '') {
          return 0;
        }

        return (
          moment(local[b].lastMessage.date).valueOf() - moment(local[a].lastMessage.date).valueOf()
        );
      });
    setChannelList(channelList);
  }, [local]);
  useEffect(() => {
    if (width !== prevWidth) {
      if (['xs', 'sm', 'md'].includes(width)) {
        setRightSpace(0);

        if (currentChannel) {
          setLeftSpace(0);
        } else {
          setLeftSpace(curSize);
        }
      } else {
        setLeftSpace(curSize);
      }
    }

    if (currentChannel && !isLoading && !['xs', 'sm', 'md'].includes(width)) {
      setRightSpace(3);
    }

    setPrevWidth(width);
  }, [prevWidth, width, curSize, currentChannel, isLoading]);

  // This effect is to keep the index of last read message.
  useEffect(() => {
    // We just want to update the last read message info only if the channel is changed.
    if (currentChannel?.sid === lastReadMessageInfo.channelId) {
      return;
    }
    setLastReadMessageInfo({
      lastIndex: currentChannel?.channelState.lastConsumedMessageIndex,
      channelId: currentChannel?.sid
    });
  }, [currentChannel, lastReadMessageInfo]);

  const handleBlock = useCallback(
    async (blockedUserId) => {
      try {
        await blockUser({
          userId,
          blockedUserId: blockedUserId
        });
        await handleBlockUser({
          blockedUserId
        });
        setCurrentChannel(null);
      } catch (err) {
        /* NONE */
      }
    },
    [handleBlockUser, setCurrentChannel, userId]
  );
  const onCollapseLeft = useCallback(() => {
    if (['xs', 'sm', 'md'].includes(width)) {
      setRightSpace(0);
    }

    setLeftSpace(leftSpace ? 0 : curSize);
  }, [width, curSize, leftSpace]);
  const onCollapseRight = useCallback(() => {
    if (['xs'].includes(width)) {
      setLeftSpace(0);
    }

    setRightSpace(rightSpace ? 0 : curSize);
  }, [width, curSize, rightSpace]);
  const renderIcon = useCallback((d) => (d ? <IconLeft /> : <IconRight />), []);
  return (
    <Grid
      className={cx(leftSpace !== 0 ? classes.container : classes.directContainer)}
      direction="row"
      container
    >
      <IconButton
        className={cx(
          classes.expandButton,
          leftSpace !== 0 ? classes.sidebarButton : classes.bodyButton
        )}
        onClick={onCollapseLeft}
      >
        {renderIcon(leftSpace !== 0)}
      </IconButton>
      {leftSpace !== 0 && (
        <Grid
          item
          xs={(leftSpace || 1) as any}
          className={leftSpace !== 0 ? classes.left : classes.hidden}
        >
          <LeftMenu
            channels={channels}
            channelList={channelList}
            local={local}
            oneTouchSendOpen={oneTouchSendOpen}
            setOneTouchSend={setOneTouchSend}
            handleNewChannel={handleNewChannel}
            setCurrentChannel={setCurrentChannel}
            lastChannelSid={lastChannelSid}
            userId={userId}
            isLoading={isLoading}
            client={client}
            permission={permission}
            onNewChannel={onNewChannel}
            newChannel={newChannel}
            currentChannel={currentChannel}
            onOpenChannel={onOpenChannel}
            handleMarkAsRead={handleMarkAsRead}
            handleMuteChannel={handleMuteChannel}
            handleUpdateGroupName={updateGroupName}
            handleRemoveChannel={handleRemove}
          />
        </Grid>
      )}
      {leftSpace !== 12 && (
        <Grid item xs={(12 - leftSpace - rightSpace) as any} className={classes.main}>
          <Main
            isLoading={isLoading}
            newMessage={newMessage}
            channelList={channelList}
            selectedChannelId={currentChannelId}
            setMainMessage={setMainMessage}
            mainMessage={mainMessage}
            handleBlock={handleBlock}
            messageLoading={messageLoading}
            startMessageLoading={startMessageLoading}
            onCollapseLeft={onCollapseLeft}
            onCollapseRight={onCollapseRight}
            local={local}
            leftSpace={leftSpace}
            rightSpace={rightSpace}
            channel={currentChannel}
            newChannel={newChannel}
            enqueueSnackbar={enqueueSnackbar}
            user={user}
            lastReadMessageIndex={
              lastReadMessageInfo.channelId === currentChannel.sid
                ? lastReadMessageInfo.lastIndex
                : null
            }
            handleUpdateGroupName={updateGroupName}
            setRightPanel={handleOpenRightPanel}
            onSend={() => {
              if (onboardingListVisible) {
                setTimeout(() => getOnboardingList(), 1000);
              }
            }}
          />
        </Grid>
      )}
      <Grid
        item
        xs={(rightSpace || 1) as any}
        className={rightSpace !== 0 ? classes.right : classes.hidden}
      >
        <RightMenu
          handleRemoveChannel={handleRemove}
          userId={userId}
          schoolId={schoolId}
          channel={currentChannel}
          local={local}
        />
      </Grid>
    </Grid>
  );
};

const mapStateToProps = ({ user, chat, onboarding }: StoreState): {} => ({
  user,
  chat,
  onboardingListVisible: onboarding.onboardingList.visible
});

const mapDispatchToProps = (dispatch: any): {} =>
  bindActionCreators(
    {
      handleMarkAsRead: chatActions.handleMarkAsRead,
      handleMuteChannel: chatActions.handleMuteChannel,
      handleBlockUser: chatActions.handleBlockUser,
      handleRemoveChannel: chatActions.handleRemoveChannel,
      setMainMessage: chatActions.setMainMessage,
      handleNewChannel: chatActions.handleNewChannel,
      setCurrentChannel: chatActions.setCurrentChannel,
      handleUpdateFriendlyName: chatActions.handleUpdateFriendlyName,
      setOneTouchSend: chatActions.setOneTouchSend,
      startMessageLoading: chatActions.startMessageLoading,
      setCurrentChannelSid: chatActions.setCurrentChannelSid,
      getOnboardingList: OnboardingActions.getOnboardingList,
      enqueueSnackbar: notificationsActions.enqueueSnackbar
    },
    dispatch
  );

export default connect<{}, {}, Props>(mapStateToProps, mapDispatchToProps)(withWidth()(DirectChat));
