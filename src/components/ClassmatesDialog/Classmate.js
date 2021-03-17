// @flow

import React, { useState,useMemo, useCallback } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import * as chatActions from 'actions/chat';
import { bindActionCreators } from 'redux';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import withWidth from '@material-ui/core/withWidth'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import ListSubheader from '@material-ui/core/ListSubheader';
import Link from '@material-ui/core/Link';
import ChatIcon from '@material-ui/icons/Chat';
import VideocamRoundedIcon from '@material-ui/icons/VideocamRounded';

import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  textRoot: {
    width: 0
  },
  fullname: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: theme.circleIn.palette.primaryText1
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  sendMessage: {
    fontWeight: 'bold',
    backgroundColor: theme.circleIn.palette.sendMessageButton,
    borderRadius: theme.spacing(2),
    color: theme.circleIn.palette.textOffwhite
  },
  videoChat: {
    fontWeight: 'bold',
    color: theme.circleIn.palette.textOffwhite,
    marginLeft: theme.spacing(),
    backgroundColor: theme.circleIn.palette.brand,
    borderRadius: theme.spacing(2),
  }
}));

type ClassmateType = {
  userId: string,
  firstName: string,
  lastName: string,
  image: string
};

type Props = {
  classmate: ClassmateType,
  openChannelWithEntity: Function,
  videoEnabled: boolean,
  width: string
};

const MyProfileLink = React.forwardRef(({ href, ...props }, ref) =>
  <RouterLink to={href} {...props} ref={ref} />);

const Classmate = ({ courseDisplayName, videoEnabled, openChannelWithEntity, width, classmate }: Props) => {
  const classes = useStyles();
  const [loadingMessage, setLoadingMessage] = useState(false)
  const [loadingVideo, setLoadingVideo] = useState(false)

  const openChat = useCallback(isVideo => {
    if (isVideo) setLoadingVideo(true)
    else setLoadingMessage(true)
    openChannelWithEntity({
      entityId: classmate.userId,
      entityFirstName: classmate.firstName,
      entityLastName: classmate.lastName,
      entityVideo: isVideo,
      notRegistered: classmate.notRegistered,
      fullscreen: true && !isVideo
    })
    setTimeout(() => {
      setLoadingVideo(false)
      setLoadingMessage(false)
    }, 2000)
  }, [classmate.firstName, classmate.lastName, classmate.notRegistered, classmate.userId, openChannelWithEntity])

  const classList = useMemo(() => {

    if (courseDisplayName) return null

    return (
`${classmate.classes[0].className} ${
  classmate.classes.length > 1
    ? `, ${classmate.classes[1].className}`
    : ''
} ${
  classmate.classes.length > 2
    ? `, +${classmate.classes.length - 2} more`
    : ''
}`
    )},[classmate.classes, courseDisplayName])


  return (
    <ListItem className={clsx(width === 'xs' && classes.buttons)}>
      <ListItemAvatar>
        <Link href={`/profile/${classmate.userId}`} component={MyProfileLink}>
          <Avatar
            alt={`Avatar n°${classmate.userId}`}
            src={classmate.image}
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
      <ListSubheader component='div' disableGutters>
        <Button
          className={classes.sendMessage}
          variant="contained"
          onClick={() => openChat(false)}
          startIcon={<ChatIcon />}
          color="primary"
        >
          {!loadingMessage ? 'Send Message' : <CircularProgress size={20}/>}
        </Button>
        {
          videoEnabled &&
          <Button
            variant="contained"
            disabled={classmate.notRegistered}
            className={classes.videoChat}
            startIcon={
              <VideocamRoundedIcon
                color={classmate.notRegistered ? 'disabled' : 'inherit'}
              />
            }
            onClick={() => openChat(true)}
            color="primary"
          >
            {loadingVideo ? <CircularProgress size={20} /> : 'Study Room'}
          </Button>
        }
      </ListSubheader>
    </ListItem>
  );
}

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      openChannelWithEntity: chatActions.openChannelWithEntity,
    },
    dispatch
  );

export default connect(
  null,
  mapDispatchToProps
)(withWidth()(Classmate))
