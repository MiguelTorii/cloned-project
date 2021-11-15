import React from 'react';
import { Action, Dispatch } from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import { useStyles } from './HudChatStyles';
import ChatLoadIndicator from './ChatLoadIndicator';
import ChatMessages from './ChatMessages';
import ChatQuill from './ChatQuill';
import { ChannelData, HudChatState } from '../chatState/hudChatState';

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
