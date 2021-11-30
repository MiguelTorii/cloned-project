import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { useStyles } from './ChatAreaStyles';
import { HudNavigationState } from '../../hud/navigationState/hudNavigationState';
import { CHAT_AREA } from '../../hud/navigationState/hudNavigation';
import ChatPage from '../../containers/CommunityChat/ChatPage';
import ChatItemSubArea from './ChatItemSubArea';

const ChatArea = () => {
  const classes: any = useStyles();

  const selectedMainArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.selectedMainArea
  );

  const selectedMainSubArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.selectedMainSubAreas[selectedMainArea]
  );

  const { hashId } = useParams();

  return (
    <div className={classes.container}>
      {selectedMainSubArea === CHAT_AREA && hashId && <ChatItemSubArea hashId={hashId} />}
      {selectedMainSubArea === CHAT_AREA && !hashId && <ChatPage />}
    </div>
  );
};

export default ChatArea;
