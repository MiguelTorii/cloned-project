import React, { useState, useMemo, useCallback } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import withWidth from '@material-ui/core/withWidth';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import ListSubheader from '@material-ui/core/ListSubheader';
import Link from '@material-ui/core/Link';
import ChatIcon from '@material-ui/icons/Chat';
import VideocamRoundedIcon from '@material-ui/icons/VideocamRounded';
import clsx from 'clsx';
import * as chatActions from '../../actions/chat';
import OnlineBadge from '../OnlineBadge/OnlineBadge';
import InviteIcon from '../../assets/svg/invite-icon.svg';
import { getInitials } from '../../utils/chat';
import useStyles from '../_styles/ClassmatesDialog/Classmate';
import { PROFILE_PAGE_SOURCE } from '../../constants/common';
import { buildPath } from '../../utils/helpers';

type ClassmateType = {
  userId: string;
  firstName: string;
  lastName: string;
  image: string;
  notRegistered: boolean;
  isOnline: boolean;
  classes: any;
};
type Props = {
  courseDisplayName: string;
  meetingInvite: boolean;
  classmate: ClassmateType;
  openChannelWithEntity?: (...args: Array<any>) => any;
  videoEnabled?: boolean;
  width?: string;
  handleInvite?: () => void;
};
const MyProfileLink = React.forwardRef<any, any>(({ href, ...props }, ref) => (
  <RouterLink to={href} {...props} ref={ref} />
));

const Classmate = ({
  courseDisplayName,
  videoEnabled,
  openChannelWithEntity,
  width,
  classmate,
  meetingInvite,
  handleInvite
}: Props) => {
  const classes: any = useStyles();
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const openChat = useCallback(
    (videoButton, isVideo) => () => {
      if (videoButton) {
        setLoadingVideo(true);
      } else {
        setLoadingMessage(true);
      }

      openChannelWithEntity({
        entityId: Number(classmate.userId),
        entityFirstName: classmate.firstName,
        entityLastName: classmate.lastName,
        entityVideo: isVideo,
        notRegistered: classmate.notRegistered,
        fullscreen: true && !isVideo
      });
      setTimeout(() => {
        setLoadingVideo(false);
        setLoadingMessage(false);
      }, 4000);
    },
    [
      classmate.firstName,
      classmate.lastName,
      classmate.notRegistered,
      classmate.userId,
      openChannelWithEntity
    ]
  );
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

    return classmate.notRegistered ? 'Invite to CircleIn' : 'Study Room';
  }, [classmate.notRegistered, loadingVideo]);
  const initials = useMemo(() => {
    const name = `${classmate?.firstName} ${classmate?.lastName}`;
    return getInitials(name);
  }, [classmate]);
  return (
    <ListItem className={clsx(width === 'xs' && classes.buttons)}>
      <ListItemAvatar>
        <Link
          href={buildPath(`/profile/${classmate.userId}`, {
            from: PROFILE_PAGE_SOURCE.CLASSMATES_MODAL
          })}
          component={MyProfileLink}
        >
          <OnlineBadge isOnline={classmate.isOnline} bgColorPath="circleIn.palette.feedBackground">
            <Avatar
              alt={`Avatar n°${classmate.userId}`}
              className={classes.avatarProfile}
              src={classmate.image}
            >
              {initials}
            </Avatar>
          </OnlineBadge>
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
        {!meetingInvite && (
          <Button
            className={classes.sendMessage}
            variant="contained"
            onClick={openChat(false, false)}
            startIcon={<ChatIcon />}
            color="primary"
          >
            {!loadingMessage ? 'Send Message' : <CircularProgress size={20} />}
          </Button>
        )}
        {videoEnabled && (
          <Button
            variant="contained"
            className={classmate.notRegistered ? classes.invite : classes.videoChat}
            startIcon={
              !classmate.notRegistered ? (
                <VideocamRoundedIcon />
              ) : (
                <img alt="invite" src={InviteIcon} />
              )
            }
            onClick={openChat(true, !classmate.notRegistered)}
            color="primary"
          >
            {videoButtonText}
          </Button>
        )}
      </ListSubheader>
    </ListItem>
  );
};

const mapDispatchToProps = (dispatch: any): {} =>
  bindActionCreators(
    {
      openChannelWithEntity: chatActions.openChannelWithEntity
    },
    dispatch
  );

export default connect<{}, {}, Props>(null, mapDispatchToProps)(withWidth()(Classmate));
