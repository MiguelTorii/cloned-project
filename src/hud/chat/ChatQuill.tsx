import React from 'react';
import { Action, Dispatch } from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '@material-ui/core';
import { useStyles } from './HudChatStyles';
import MessageQuill from '../../containers/CommunityChat/MessageQuill';
import { ChannelData, HudChatState } from '../chatState/hudChatState';

const ChatQuill = () => {
  const classes: any = useStyles();

  const dispatch: Dispatch<Action> = useDispatch();

  const selectedChannelId = useSelector(
    (state: { hudChat: HudChatState }) => state.hudChat.selectedChannelId
  );

  const channel: ChannelData = useSelector(
    (state: { hudChat: HudChatState }) => state.hudChat.idToChannel[selectedChannelId]
  );

  return <div>{`Chat quill for selected channel ${selectedChannelId} goes here.`}</div>;
};

export default ChatQuill;
