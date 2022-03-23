import React from 'react';

import { useSelector, useDispatch } from 'react-redux';

import ChatLoadIndicator from './ChatLoadIndicator';
import ChatMessages from './ChatMessages';
import ChatQuill from './ChatQuill';
import { useStyles } from './HudChatStyles';

import type { ChannelData, HudChatState } from '../chatState/hudChatState';
import type { Action, Dispatch } from 'redux';

const ChatMessagesSection = () => {
  const classes: any = useStyles();

  const dispatch: Dispatch<Action> = useDispatch();

  const selectedChannelId = useSelector(
    (state: { hudChat: HudChatState }) => state.hudChat.selectedChannelId
  );

  const channel: ChannelData = useSelector(
    (state: { hudChat: HudChatState }) => state.hudChat.idToChannel[selectedChannelId]
  );

  return (
    <div className={classes.chatMessagesPane}>
      {channel ? (
        <>
          <ChatMessages />
          <ChatQuill />
        </>
      ) : (
        <ChatLoadIndicator />
      )}
    </div>
  );
};

export default ChatMessagesSection;
