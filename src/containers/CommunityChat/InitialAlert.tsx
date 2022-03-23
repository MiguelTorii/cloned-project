/* eslint-disable no-nested-ternary */
import { memo } from 'react';

import clsx from 'clsx';

import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import GroupIcon from '@material-ui/icons/Group';

import { getInitials, parseChannelMetadata } from 'utils/chat';

import { ReactComponent as CommunityGroupIcon } from 'assets/svg/community_chat_group.svg';
import avatarImg from 'assets/svg/icon-kobe.svg';
import LoadImg from 'components/LoadImg/LoadImg';

import useStyles from './_styles/initialAlert';

import type { ChannelMetadata } from 'features/chat';
import type { CommunityChannelData } from 'reducers/chat';
import type { Channel } from 'twilio-chat';

export const DefaultInitialAlert = ({
  metadata,
  title,
  userId
}: {
  metadata: ChannelMetadata;
  title?: string;
  userId: string;
}) => {
  const classes = useStyles();
  const { isDirectChat, isGroupChat, thumbnail, name } = parseChannelMetadata(userId, metadata);

  const initials = getInitials(name);

  return (
    <Box className={classes.root}>
      <Avatar
        className={clsx(
          classes.avatarProfile,
          thumbnail ? classes.imageProfile : classes.iconProfile
        )}
        src={thumbnail}
      >
        {isGroupChat ? <GroupIcon /> : initials}
      </Avatar>
      <Typography className={classes.members} variant="h5">
        {isDirectChat ? `You and ${name}` : title || name}
      </Typography>
      <Typography className={classes.initialAlertDescription} variant="subtitle2">
        This is the beginning of your chat with
        {isDirectChat ? ` ${name}` : ' your group.'}
      </Typography>
    </Box>
  );
};

export const CommunityInitialAlert = ({
  channel,
  selectedChannel
}: {
  channel: Channel;
  selectedChannel?: CommunityChannelData;
}) => {
  const classes = useStyles();

  return channel.lastConsumedMessageIndex === null ? (
    <Box
      className={classes.root}
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <LoadImg className={classes.avatarImg} url={avatarImg} />
      <Typography className={classes.members} variant="h5">
        Welcome To #{selectedChannel?.chat_name}
      </Typography>
      <Typography className={classes.initialAlert} variant="subtitle2">
        Start this chat by sending a message below to light the way for your classmates!………Who knows
        you might make a friend?
      </Typography>
    </Box>
  ) : (
    <Box className={classes.root}>
      <CommunityGroupIcon className={classes.avatarProfile} />
      <Typography className={classes.members} variant="h5">
        #{selectedChannel?.chat_name}
      </Typography>
      <Typography className={classes.initialAlertDescription} variant="subtitle2">
        This is the beginning of your chat with your group.
      </Typography>
    </Box>
  );
};
