import React from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { useStyles } from './HudChatStyles';

import type { ChannelData, HudChatState } from '../chatState/hudChatState';
import type { Action, Dispatch } from 'redux';

const ChatMessages = () => {
  const classes: any = useStyles();

  const dispatch: Dispatch<Action> = useDispatch();

  const selectedChannelId = useSelector(
    (state: { hudChat: HudChatState }) => state.hudChat.selectedChannelId
  );

  const channel: ChannelData = useSelector(
    (state: { hudChat: HudChatState }) => state.hudChat.idToChannel[selectedChannelId]
  );

  return <div />;
};

export default ChatMessages;
