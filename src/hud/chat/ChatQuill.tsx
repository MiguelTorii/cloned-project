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

  return (
    <>
      {/* <MessageQuill
        isCommunityChat={isCommunityChat}
        value={value}
        userId={userId}
        setFiles={setFiles}
        files={files}
        focusMessageBox={focusMessageBox}
        onSendMessage={onSendMessage}
        onChange={handleRTEChange}
        showNotification={showNotification}
        setValue={setValue}
        handleClick={handleClick}
        onTyping={onTyping}
        showError={showError}
      />

      <div className={classes.typing}>
        <Typography className={classes.typingText} variant="subtitle1">
          {typing && typing.channel === channel.sid ? `${typing.friendlyName} is typing ...` : ''}
        </Typography>
      </div> */}
    </>
  );
};

export default ChatQuill;
