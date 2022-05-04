import truncate from 'lodash/truncate';

import { Avatar, ListItem, ListItemAvatar, ListItemText, Typography } from '@material-ui/core';
import GroupIcon from '@material-ui/icons/Group';

import { getInitials } from 'utils/chat';

import { useChannelById } from 'features/chat';
import useParsedChannelMetadataById from 'features/chat/hooks/useParsedChannelMetadataById';
import useTimeAgo from 'hooks/useTimeAgo';

import useStyles from './ChannelItemStyles';

type ChannelItemProps = {
  sid: string;
  onClick: () => void;
};

const ChannelItem = ({ sid, onClick }: ChannelItemProps) => {
  const classes = useStyles();
  const { data: channel, isFetched } = useChannelById(sid);
  const { data: metadata } = useParsedChannelMetadataById(sid);
  const { isDirectChat, name, groupName, thumbnail, lastMessageData } = metadata || {};
  const timeAgo = useTimeAgo(lastMessageData?.dateSent || Date.now(), 60000);

  if (!isFetched) {
    return null;
  }

  return (
    <ListItem button key={sid} onClick={onClick}>
      <ListItemAvatar>
        <Avatar src={thumbnail} className={thumbnail ? classes.avatarProfile : classes.iconProfile}>
          {isDirectChat ? getInitials(name) || <GroupIcon /> : <GroupIcon />}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        secondaryTypographyProps={{
          color: 'textPrimary'
        }}
        primary={channel?.friendlyName || (isDirectChat ? name : groupName)}
        secondary={
          <span
            dangerouslySetInnerHTML={{
              __html: lastMessageData?.message || ''
            }}
          />
        }
        classes={{
          primary: classes.primary,
          secondary: classes.secondary
        }}
      />
      <Typography variant="subtitle2" className={classes.time}>
        {timeAgo}
      </Typography>
    </ListItem>
  );
};

export default ChannelItem;
