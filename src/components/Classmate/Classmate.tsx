import React, { useState, useMemo, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import withWidth from '@material-ui/core/withWidth';
import Fab from '@material-ui/core/Fab';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Button from '@material-ui/core/Button';
import ListSubheader from '@material-ui/core/ListSubheader';
import Link from '@material-ui/core/Link';
import ChatIcon from '@material-ui/icons/Chat';
import CircularProgress from '@material-ui/core/CircularProgress';
import VideocamRoundedIcon from '@material-ui/icons/VideocamRounded';

import Avatar from 'components/Avatar';
import { useMediaQuery } from 'hooks';
import { Dispatch } from 'types/store';
import { getInitials } from 'utils/chat';
import { buildPath } from 'utils/helpers';
import { ChatState } from 'reducers/chat';
import { CampaignState } from 'reducers/campaign';
import { openChannelWithEntity } from 'actions/chat';
import InviteIcon from 'assets/svg/invite-icon.svg';
import { PROFILE_PAGE_SOURCE } from 'constants/common';

import { useStyles } from './ClassmateStyles';

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
  videoEnabled?: boolean;
  width?: string;
};

const MyProfileLink = React.forwardRef<any, any>(({ href, ...props }, ref) => (
  <RouterLink to={href} {...props} ref={ref} />
));

const Classmate = ({ courseDisplayName, videoEnabled, width, classmate, meetingInvite }: Props) => {
  const classes: any = useStyles();
  const dispatch: Dispatch = useDispatch();
  const { isMobileScreen } = useMediaQuery();

  const isHud: boolean | null = useSelector(
    (state: { campaign: CampaignState }) => state.campaign.hud
  );

  const {
    data: { client }
  } = useSelector((state: { chat: ChatState }) => state.chat);

  const [loadingMessage, setLoadingMessage] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(false);

  // TODO CHAT_REFACTOR: Move logic into a chat hook
  const openChat = useCallback(
    (videoButton: boolean, isVideo: boolean) => () => {
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
        fullscreen: true && !isVideo,
        isHud,
        client
      })(dispatch);

      // TODO CHAT_REFACTOR: remove this setTimeout and use promise status to determine whether the
      // load process has finished.
      setTimeout(() => {
        setLoadingVideo(false);
        setLoadingMessage(false);
      }, 4000);
    },
    [classmate.firstName, classmate.lastName, classmate.userId, dispatch, isHud, client]
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
    <ListItem
      className={clsx(width === 'xs' && classes.buttons, isMobileScreen && classes.mobileContainer)}
    >
      <ListItemAvatar>
        <Link
          href={buildPath(`/profile/${classmate.userId}`, {
            from: PROFILE_PAGE_SOURCE.CLASSMATES_MODAL
          })}
          component={MyProfileLink}
        >
          <Avatar
            profileImage={classmate.image}
            isOnline={classmate.isOnline}
            onlineBadgeBackground="circleIn.palette.feedBackground"
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
        {!meetingInvite && !isMobileScreen && (
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

        {!meetingInvite && isMobileScreen && (
          <Fab size="small" color="primary">
            <ChatIcon />
          </Fab>
        )}

        {videoEnabled && isMobileScreen && (
          <Fab size="small" color="primary" className={classes.rightIconButton}>
            {!classmate.notRegistered ? (
              <VideocamRoundedIcon />
            ) : (
              <img alt="invite" src={InviteIcon} />
            )}
          </Fab>
        )}

        {videoEnabled && !isMobileScreen && (
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

export default withWidth()(Classmate);
