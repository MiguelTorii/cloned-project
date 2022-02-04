import React, { useState, useMemo, useCallback } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link as RouterLink } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import withWidth from '@material-ui/core/withWidth';
import Button from '@material-ui/core/Button';
import ListSubheader from '@material-ui/core/ListSubheader';
import Link from '@material-ui/core/Link';
import VideocamRoundedIcon from '@material-ui/icons/VideocamRounded';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import clsx from 'clsx';

import Avatar from 'components/Avatar';
import { getInitials } from '../../utils/chat';
import useStyles from './_styles/Classmate';
import { buildPath } from '../../utils/helpers';
import { PROFILE_PAGE_SOURCE } from '../../constants/common';

type ClassmateType = {
  userId: string;
  firstName: string;
  lastName: string;
  image: string;
  classes: any;
};

type Props = {
  courseDisplayName?: string;
  meetingInvite?: boolean;
  classmate?: ClassmateType;
  videoEnabled?: boolean;
  isInvited?: boolean;
  width?: string;
  handleInvite?: (invite: any) => void;
};

const MyProfileLink = React.forwardRef<any, any>(({ href, ...props }, ref) => (
  <RouterLink to={href} {...props} ref={ref} />
));

const Classmate = ({
  courseDisplayName,
  videoEnabled,
  isInvited,
  width,
  classmate,
  meetingInvite,
  handleInvite
}: Props) => {
  const classes: any = useStyles();
  const [loadingVideo, setLoadingVideo] = useState(false);
  const handleClick = useCallback(async () => {
    setLoadingVideo(true);

    try {
      await handleInvite({
        chatType: 'group',
        name: '',
        type: '',
        selectedUsers: [classmate]
      });
    } catch (e) {
      setLoadingVideo(false);
    }

    setLoadingVideo(false);
  }, [setLoadingVideo, classmate, handleInvite]);
  const classList = useMemo(() => {
    if (courseDisplayName) {
      return null;
    }

    return `${classmate.classes[0].className} ${
      classmate.classes.length > 1 ? `, ${classmate.classes[1].className}` : ''
    } ${classmate.classes.length > 2 ? `, +${classmate.classes.length - 2} more` : ''}`;
  }, [classmate.classes, courseDisplayName]);
  const videoButtonText = useMemo(() => {
    if (loadingVideo) {
      return <CircularProgress size={20} />;
    }

    return isInvited ? 'Invited' : 'Invite now';
  }, [isInvited, loadingVideo]);
  const initials = useMemo(() => {
    const name = `${classmate?.firstName} ${classmate?.lastName}`;
    return getInitials(name);
  }, [classmate]);
  return (
    <ListItem className={clsx(width === 'xs' && classes.buttons)}>
      <ListItemAvatar>
        <Link
          href={buildPath(`/profile/${classmate.userId}`, {
            from: PROFILE_PAGE_SOURCE.CHAT
          })}
          component={MyProfileLink}
        >
          <Avatar
            isOnline={(classmate as any).isOnline}
            onlineBadgeBackground="circleIn.palette.feedBackground"
            profileImage={classmate.image}
            initials={initials}
            fromChat
          />
        </Link>
      </ListItemAvatar>
      <ListItemText
        classes={{
          root: classes.textRoot,
          primary: classes.fullname,
          secondary: classes.fullname
        }}
        primary={`${classmate.firstName} ${classmate.lastName}`}
        secondary={classList}
      />
      <ListSubheader component="div" disableGutters>
        {videoEnabled && (
          <Button
            variant="contained"
            className={isInvited ? classes.invited : classes.invite}
            startIcon={
              isInvited ? (
                <CheckCircleIcon className={classes.circleCheck} />
              ) : (
                <VideocamRoundedIcon />
              )
            }
            onClick={handleClick}
            color="primary"
          >
            {videoButtonText}
          </Button>
        )}
      </ListSubheader>
    </ListItem>
  );
};

export default withWidth()(Classmate);
