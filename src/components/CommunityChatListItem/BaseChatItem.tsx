import { memo } from 'react';
import cx from 'classnames';

import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import GroupIcon from '@material-ui/icons/Group';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';

import { getInitials } from 'utils/chat';

import OnlineBadge from 'components/OnlineBadge';

import useStyles from './_styles/mainChatItem';

type Props = {
  dark?: boolean;
  imageProfile?: string;
  isDirectChat?: boolean;
  isOnline?: boolean;
  memberLength?: number;
  muted?: boolean;
  name?: string;
  onClick?: () => void;
  roomName?: string;
  selected?: boolean;
  unReadCount?: number;
};

const BaseChatItem = ({
  dark,
  imageProfile,
  isDirectChat,
  isOnline,
  memberLength,
  muted,
  name = '',
  onClick,
  roomName = 'New Chat',
  selected,
  unReadCount
}: Props) => {
  const classes = useStyles();

  const initials = getInitials(name);

  return (
    <ButtonBase
      className={cx(classes.root, {
        [classes.dark]: dark,
        [classes.selected]: selected
      })}
      onClick={onClick}
    >
      <OnlineBadge
        isVisible={isDirectChat}
        isOnline={isOnline}
        bgColorPath={dark ? 'circleIn.palette.feedBackground' : 'circleIn.palette.appBar'}
      >
        <Avatar className={classes.avatarProfile} src={imageProfile}>
          {isDirectChat ? initials || <GroupIcon /> : <GroupIcon />}
        </Avatar>
      </OnlineBadge>
      <div className={classes.grow}>
        <Typography className={classes.roomName} variant="subtitle1" noWrap>
          {roomName}
        </Typography>
        {memberLength && memberLength > 2 && (
          <Typography className={classes.groupMemberCount} variant="subtitle1" noWrap>
            {memberLength} members
          </Typography>
        )}
      </div>
      {muted && <NotificationsOffIcon />}
      <Badge className={classes.margin} badgeContent={unReadCount} color="secondary">
        <span />
      </Badge>
    </ButtonBase>
  );
};

export default memo(BaseChatItem);
