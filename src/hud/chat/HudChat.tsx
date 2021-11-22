import React from 'react';
import { useSelector } from 'react-redux';
import ChatMessages from './ChatMessages';
import ChatChannels from './ChatChannels';
import useChat from '../chatState/useChat';
import { useStyles } from './HudChatStyles';

const HudChat = () => {
  const classes: any = useStyles();

  const { loadChat } = useChat();
  loadChat();

  return (
    <div className={classes.container}>
      <div className={classes.chatModule} />
      <ChatMessages />
      <ChatChannels />
    </div>
  );
};

export default HudChat;
