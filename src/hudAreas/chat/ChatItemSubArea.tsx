import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import ChatPage from '../../containers/CommunityChat/ChatPage';
import { getChatIdFromHash } from '../../api/chat';
import { enqueueSnackbar } from '../../actions/notifications';
import { ChatState } from '../../reducers/chat';
import { useStyles } from './ChatAreaStyles';
import { setCurrentChannel } from '../../actions/chat';
import { Dispatch } from '../../types/store';

type Props = {
  hashId: string;
};

const ChatItemSubArea = ({ hashId }: Props) => {
  const classes: any = useStyles();

  const dispatch: Dispatch = useDispatch();

  const channels = useSelector((state: { chat: ChatState }) => state.chat.data.channels);

  useEffect(() => {
    const validateChatId = async () => {
      const chatId = await getChatIdFromHash(hashId);
      if (chatId) {
        const channel = channels.find((e) => e.sid === chatId);
        setCurrentChannel(channel)(dispatch);
      } else {
        // invalid channel, redirect to homepage with notification
        enqueueSnackbar({
          notification: {
            message: 'Chat link is invalid!',
            options: {
              variant: 'error',
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left'
              },
              autoHideDuration: 3000
            }
          }
        });
        dispatch(push('/'));
      }
    };

    validateChatId(); // eslint-disable-next-line
  }, []);

  return <ChatPage />;
};

export default ChatItemSubArea;
