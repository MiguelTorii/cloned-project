/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useMemo } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import GroupIcon from '@material-ui/icons/Group';
import LoadImg from '../../components/LoadImg/LoadImg';
import InitialCommunityImage from '../../assets/svg/community_first_time.svg';
import avatarImg from '../../assets/svg/icon-kobe.svg';
import { getInitials } from '../../utils/chat';
import { ReactComponent as CommunityGroupIcon } from '../../assets/svg/community_chat_group.svg';
import useStyles from './_styles/initialAlert';
import { ChannelWrapper, CurrentCommunity } from '../../reducers/chat';

type Props = {
  local?: Record<string, ChannelWrapper>;
  channel?: ChannelWrapper;
  userId?: string;
  isCommunityChat?: boolean;
  selectedChannel?: Record<string, any>;
  hasPermission?: boolean;
  focusMessageBox: any;
  setFocusMessageBox: any;
  handleUpdateGroupName: any;
  currentCommunity: CurrentCommunity;
};

const InitialAlert = ({
  local,
  channel,
  userId,
  isCommunityChat,
  selectedChannel,
  hasPermission,
  focusMessageBox,
  setFocusMessageBox,
  handleUpdateGroupName,
  currentCommunity
}: Props) => {
  const classes: any = useStyles();
  const [isOneToOne, setIsOneToOne] = useState(true);
  const [name, setName] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  useEffect(() => {
    if (channel && channel.members) {
      if (local[channel.sid].members.length === 2) {
        local[channel.sid].members.forEach((member) => {
          if (Number(member.userId) !== Number(userId)) {
            setName(`${member.firstname} ${member.lastname}`);
            setThumbnail(member.image);
            setIsOneToOne(true);
          }
        });
      } else {
        setThumbnail(local[channel.sid].thumbnail);
        setName(local[channel.sid].title);
        setIsOneToOne(false);
      }
    }
  }, [channel, local, userId]);
  const initials = useMemo(() => getInitials(name), [name]);
  return isCommunityChat ? (
    // Use `any` type because `Property 'channelState' is private and only accessible within class 'Channel'.`
    (local[channel?.sid]?.twilioChannel as any)?.channelState?.lastConsumedMessageIndex === null ? (
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
          Start this chat by sending a message below to light the way for your classmates!………Who
          knows you might make a friend?
        </Typography>
      </Box>
    ) : (
      <Box className={classes.root}>
        <CommunityGroupIcon />
        <Typography className={classes.members} variant="h5">
          #{selectedChannel?.chat_name}
        </Typography>
        <Typography className={classes.initialAlertDescription} variant="subtitle2">
          This is the beginning of your chat with
          {isOneToOne ? name : ' your group.'}
        </Typography>
      </Box>
    )
  ) : (
    <Box className={classes.root}>
      <Avatar className={classes.avatarProfile} src={thumbnail}>
        {local[channel.sid].members.length > 2 ? <GroupIcon /> : initials}
      </Avatar>
      <Typography className={classes.members} variant="h5">
        {local[channel.sid].members.length === 2 ? `You and ${name}` : name}
      </Typography>
      <Typography className={classes.initialAlertDescription} variant="subtitle2">
        This is the beginning of your chat with
        {isOneToOne ? ` ${name}` : ' your group.'}
      </Typography>
    </Box>
  );
};

export default InitialAlert;
