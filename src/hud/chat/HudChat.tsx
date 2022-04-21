import React from 'react';

import { useSelector } from 'react-redux';

import useChat from '../chatState/useChat';

import ChatChannels from './ChatChannels';
import ChatMessages from './ChatMessages';
import { useStyles } from './HudChatStyles';

// TODO: Remove component, doesn't seem used
const HudChat = () => {
  const classes: any = useStyles();

  const { loadChat } = useChat();
  loadChat();

  return (
    <div className={classes.container}>
      <ChatChannels />
      <ChatMessages />
    </div>
  );
};

export default HudChat;
