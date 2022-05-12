import { useCallback, useEffect } from 'react';

import { push } from 'connected-react-router';
import parse from 'html-react-parser';
import { truncate } from 'lodash';

import { Button } from '@material-ui/core';

import { URL } from 'constants/navigation';
import { generateChatPath } from 'utils/chat';

import { navigateToDM, setCurrentCommunityIdAction } from 'actions/chat';
import { closeSnackbar, enqueueSnackbar } from 'actions/notifications';
import { updateTitle } from 'actions/web-notifications';
import { usePrevious } from 'hooks';
import { useAppDispatch, useAppSelector } from 'redux/store';

import type { Conversation } from '@twilio/conversations';

const MESSAGE_CONTENT_CHARACTER_LIMIT = 50;

const useMessageNotifier = () => {
  const dispatch = useAppDispatch();

  const { newMessage, selectedChannelId, currentCommunityChannelId, currentCommunityId } =
    useAppSelector((state) => state.chat.data);
  const pathname = useAppSelector((state) => state.router.location.pathname);
  const userId = useAppSelector((state) => state.user.data.userId);
  const local = useAppSelector((state) => state.chat.data.local);

  const willNotShowNotification = useCallback(
    (channel) => {
      if (!pathname.includes(URL.CHAT)) return;

      if (!currentCommunityId) {
        return selectedChannelId === channel.sid;
      }

      return currentCommunityChannelId === channel.sid;
    },
    [currentCommunityId, selectedChannelId, currentCommunityChannelId, pathname]
  );

  const handleOpenChannel = useCallback(
    (channel: Conversation) => {
      const communityId = newMessage?.conversation?.attributes?.community_id;
      if (communityId) {
        dispatch(push(generateChatPath(communityId, channel.sid)));
      } else {
        dispatch(navigateToDM(channel.sid));
        dispatch(setCurrentCommunityIdAction(null));
      }
    },
    [dispatch, newMessage?.conversation?.attributes?.community_id]
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

  const prevMessage = usePrevious(newMessage);

  useEffect(() => {
    const handleMessage = () => {
      if (!newMessage) return;
      const { author, attributes, body, conversation: channel } = newMessage;
      const { firstName, lastName, files } = attributes;

      if (
        Number(author) === Number(userId) ||
        willNotShowNotification(channel.sid) ||
        local[channel.sid].muted
      ) {
        return;
      }

      const msg = `${firstName} ${lastName} sent you a message:`;
      let fullMessageContent = '';

      // TODO Review these conditions
      if (!body) {
        fullMessageContent = notificationMessageWithoutBody(files, `${firstName} ${lastName}`);
      } else if (typeof parse(body) === 'string') {
        fullMessageContent = body;
      } else {
        // TODO add unit tests for regex.
        fullMessageContent = body.replace(/(<([^>]+)>)/gi, '');
      }

      const messageContent = truncate(fullMessageContent, {
        length: MESSAGE_CONTENT_CHARACTER_LIMIT
      });
      dispatch(
        enqueueSnackbar({
          notification: {
            message: `${msg} ${messageContent}`,
            options: {
              variant: 'info',
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
              },
              action: (key) => (
                <>
                  <Button
                    onClick={() => {
                      handleOpenChannel(channel);
                      dispatch(closeSnackbar(key));
                    }}
                  >
                    Open
                  </Button>
                  <Button
                    onClick={() => {
                      dispatch(closeSnackbar(key));
                    }}
                  >
                    Dismiss
                  </Button>
                </>
              ),
              autoHideDuration: 3000
            }
          }
        })
      );
      updateTitle({
        title: `${firstName} ${lastName} sent you a message:`,
        body: messageContent
      });
    };

    if (newMessage && prevMessage?.sid !== newMessage.sid) {
      handleMessage();
    }
  }, [
    dispatch,
    handleOpenChannel,
    local,
    newMessage,
    prevMessage?.sid,
    willNotShowNotification,
    userId
  ]);
};

export default useMessageNotifier;
