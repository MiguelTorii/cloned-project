import { useState, useCallback } from 'react';

import { Typography } from '@material-ui/core';

import { useTyping } from 'features/chat';

import useStyles from './_styles/main';
import MessageQuill from './MessageQuill';

import type { MessageQuillProps } from './MessageQuill';
import type { Channel } from 'twilio-chat';

const ChannelMessageQuill = ({
  channel,
  files,
  focusMessageBox,
  onSendMessage,
  setFiles,
  userId,
  isNamedChannel
}: MessageQuillProps & {
  channel: Channel;
}) => {
  const classes = useStyles();
  const [showError, setShowError] = useState(false);

  const { typing, onTyping } = useTyping(channel);

  const handleOnTyping = useCallback(() => {
    try {
      onTyping();
    } catch (err) {
      setShowError(true);
    }
  }, [onTyping]);

  return (
    <>
      <MessageQuill
        isNamedChannel={isNamedChannel}
        userId={userId}
        setFiles={setFiles}
        files={files}
        focusMessageBox={focusMessageBox}
        onSendMessage={onSendMessage}
        onTyping={handleOnTyping}
        showError={showError}
      />
      <div className={classes.typing}>
        <Typography className={classes.typingText} variant="subtitle1">
          {typing && typing.channelId === channel.sid ? `${typing.friendlyName} is typing ...` : ''}
        </Typography>
      </div>
    </>
  );
};

export default ChannelMessageQuill;
