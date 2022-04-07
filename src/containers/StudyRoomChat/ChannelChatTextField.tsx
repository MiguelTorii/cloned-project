import type { Dispatch, SetStateAction } from 'react';

import { Typography } from '@material-ui/core';

import { useTyping } from 'features/chat';

import ChatTextField from './ChatTextField';
import { useStyles as useStudyRoomChatStyles } from './StudyRoomChatStyles';

import type { ChatTextFieldProps } from './ChatTextField';
import type { Channel } from 'twilio-chat';

type Props = Omit<ChatTextFieldProps, 'onTyping'> & {
  channel: Channel;
  setLoading: Dispatch<SetStateAction<boolean>>;
};

const ChannelChatTextField = ({ channel, ...props }: Props) => {
  const { typing, onTyping } = useTyping(channel);

  const classes = useStudyRoomChatStyles();

  return (
    <>
      <div className={classes.typing}>
        <Typography className={classes.typingText} variant="subtitle1">
          {typing && typing.channelId === channel.sid ? `${typing.friendlyName} is typing ...` : ''}
        </Typography>
      </div>

      <ChatTextField {...props} onTyping={onTyping} />
    </>
  );
};

export default ChannelChatTextField;
