/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useMemo } from "react";
import cx from "classnames";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import GroupIcon from "@material-ui/icons/Group";
import LoadImg from "components/LoadImg/LoadImg";
import InitialCommunityImage from "assets/svg/community_first_time.svg";
import { getInitials } from "utils/chat";
import { ReactComponent as CommunityGroupIcon } from "assets/svg/community_chat_group.svg";
import useStyles from "./_styles/initialAlert";
type Props = {
  local: Array;
  channel: Record<string, any>;
  userId: string;
  isCommunityChat: boolean;
  selectedChannel: Record<string, any>;
};

const InitialAlert = ({
  local,
  channel,
  userId,
  isCommunityChat,
  selectedChannel
}: Props) => {
  const classes = useStyles();
  const [isOneToOne, setIsOneToOne] = useState(true);
  const [name, setName] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  useEffect(() => {
    if (channel && channel.members) {
      if (local[channel.sid].members.length === 2) {
        local[channel.sid].members.forEach(member => {
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
  return isCommunityChat ? local[channel?.sid]?.twilioChannel?.channelState?.lastConsumedMessageIndex === null ? <Box className={classes.root} display="flex" justifyContent="center" alignItems="center" flexDirection="column">
        <LoadImg url={InitialCommunityImage} />
        <Typography className={classes.members} variant="h5">
          Welcome To #{selectedChannel?.chat_name}
        </Typography>
        <Typography className={classes.initialAlert} variant="subtitle2">
          Gasp...you’re the first one here! Start this chat by sending a message below to light the
          way for your classmates! It feels good to connect with others no matter where you are. Who
          knows, you might make a friend!
        </Typography>
      </Box> : <Box className={classes.root}>
        <CommunityGroupIcon />
        <Typography className={classes.members} variant="h5">
          #{selectedChannel?.chat_name}
        </Typography>
        <Typography className={classes.initialAlertDescription} variant="subtitle2">
          This is the beginning of your chat with
          {isOneToOne ? name : ' your group.'}
        </Typography>
      </Box> : <Box className={classes.root}>
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
    </Box>;
};

export default InitialAlert;