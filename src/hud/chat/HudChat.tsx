import React from 'react';
import { useSelector } from 'react-redux';
import ChatMessages from './ChatMessages';
import ChatChannels from './ChatChannels';
import useChat from '../chatState/useChat';
import { useStyles } from './HudChatStyles';
import { HudNavigationState } from '../navigationState/hudNavigationState';
import { BOTTOM_LEFT_SIDE_AREA, TOP_LEFT_SIDE_AREA } from '../navigationState/hudNavigation';

const HudChat = () => {
  const classes: any = useStyles();

  const isTopVisible: boolean = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.sideAreaToIsVisible[TOP_LEFT_SIDE_AREA]
  );

  const isBottomVisible: boolean = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.sideAreaToIsVisible[BOTTOM_LEFT_SIDE_AREA]
  );

  const { loadChat } = useChat();
  loadChat();

  return (
    <div className={classes.container}>
      <div className={classes.chatModule} />
      {isTopVisible && <ChatMessages />}
      {isBottomVisible && <ChatChannels />}
    </div>
  );
};

export default HudChat;
