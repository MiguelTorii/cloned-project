import React from 'react';
import { Action, Dispatch } from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import Lightbox from 'react-images';
import { useStyles } from './HudChatStyles';
import InitialAlert from '../../containers/CommunityChat/InitialAlert';
import { ChannelData, HudChatState } from '../chatState/hudChatState';

const ChatMessages = () => {
  const classes: any = useStyles();

  const dispatch: Dispatch<Action> = useDispatch();

  const selectedChannelId = useSelector(
    (state: { hudChat: HudChatState }) => state.hudChat.selectedChannelId
  );

  const channel: ChannelData = useSelector(
    (state: { hudChat: HudChatState }) => state.hudChat.idToChannel[selectedChannelId]
  );

  return <div>{`Details for selected channel ${selectedChannelId} go here.`}</div>;
};

export default ChatMessages;
