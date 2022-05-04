import { useState, useCallback } from 'react';

import { Box, Typography } from '@material-ui/core';

import { useTyping } from 'features/chat';

import useStyles from './_styles/main';
import MessageQuill from './MessageQuill';

import type { MessageQuillProps } from './MessageQuill';
import type { Channel } from 'types/models';

type ChannelMessageQuillProps = Omit<MessageQuillProps, 'onTyping'> & {
  reduced?: boolean;
};

const ChannelMessageQuill = ({
  channel,
  files,
  onSendMessage,
  setFiles,
  userId,
  isNamedChannel,
  reduced = false
}: ChannelMessageQuillProps & {
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
    <Box mb={reduced ? 2 : 0}>
      <MessageQuill
        isNamedChannel={isNamedChannel}
        userId={userId}
        setFiles={setFiles}
        files={files}
        onSendMessage={onSendMessage}
        onTyping={handleOnTyping}
        showError={showError}
      />

      {!reduced && (
        <div className={classes.typing}>
          <Typography className={classes.typingText} variant="subtitle1">
            {typing && typing.channelId === channel.sid
              ? `${typing.friendlyName} is typing ...`
              : ''}
          </Typography>
        </div>
      )}
    </Box>
  );
};

export default ChannelMessageQuill;
