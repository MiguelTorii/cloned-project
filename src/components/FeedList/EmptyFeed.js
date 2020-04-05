// @flow

import React, { useEffect, useState, useRef } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import CompletedAddProfilePhoto from 'assets/svg/completed_add_profile_photo.svg'
import CompletedInvite from 'assets/svg/completed_invite.svg'
import CompletedClassGroupChatOne from 'assets/svg/completed_class_group_chat_one.svg'
import CompletedClassGroupChatTwo from 'assets/svg/completed_class_group_chat_two.svg'
import EmptyAddProfilePhotoOne from 'assets/svg/empty_add_profile_photo_one.svg'
import EmptyAddProfilePhotoTwo from 'assets/svg/empty_add_profile_photo_two.svg'
import EmptyClassGroupChatOne from 'assets/svg/empty_class_group_chat_one.svg'
import EmptyClassGroupChatTwo from 'assets/svg/empty_class_group_chat_two.svg'
import EmptyInvite from 'assets/svg/empty_invite.svg'
import { makeStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as chatActions from 'actions/chat'
import type { UserState } from 'reducers/user'
import type { ChatState } from 'reducers/chat'
import type { State as StoreState } from 'types/state'
import { updateUserProfileUrl } from 'api/user'
import { getPresignedURL } from 'api/media'
import axios from 'axios'
import CheckIcon from '@material-ui/icons/Check'
import CircularProgress from '@material-ui/core/CircularProgress'
import CreateChatChannel from 'containers/CreateChatChannel'
import * as signInActions from 'actions/sign-in'
import * as userActions from 'actions/user'
import InviteDialog from 'components/FeedList/EmptyFeed/InviteDialog'
import MoreMenu from 'components/FeedList/EmptyFeed/MoreMenu'
import { postEvent } from 'api/feed'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import IconButton from '@material-ui/core/IconButton'

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%'
  },
  imgFirst: {
    height: 92,
    objectFir: 'scale-down',
    margin: theme.spacing(0,1,0,1)
  },
  imgSecond: {
    height: 135,
    objectFir: 'scale-down'
  },
  imgThird: {
    height: 190,
    objectFir: 'scale-down'
  },
  buttonLabel: {
    fontWeight: 'bold'
  },
  buttonSuccess: {
    backgroundColor: theme.circleIn.palette.success,
  },
  hidden: {
    display: 'none'
  },
  moreIcon: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}))

type Props = {
  user: UserState,
  chat: ChatState,
  router: Object,
  handleRoomClick: Function,
  checkUserSession: Function,
  fetchClasses: Function
};

const EmptyFeed = ({
  user,
  chat,
  router,
  checkUserSession,
  handleRoomClick,
  fetchClasses
}: Props) => {
  const classes = useStyles()

  const {
    userClasses: {
      classList
    },
    data: {
      userId,
      profileImage
    }} = user
  const { data: { client, channels, online }} = chat
  const { location: { query: {
    sectionId,
    classId,
  }}} = router

  const [hide, setHide] = useState(true)
  const [profileStep, setProfileStep] = useState(profileImage !== '')
  const [channelType, setChannelType] = useState(null)
  const [inviteStep, setInviteStep] = useState(false)
  const [chatStep, setChatStep] = useState(false)
  const fileRef = useRef(null)

  const handleAddProfilePicture = async () => {
    setProfileStep(null)
    try {
      const file = fileRef.current.files[0]
      const result = await getPresignedURL({
        userId,
        type: 2,
        mediaType: file.type
      });

      const { mediaId, url } = result;

      await axios.put(url, file, {
        headers: {
          'Content-Type': file.type
        }
      });

      await updateUserProfileUrl({ userId, mediaId });
      checkUserSession();
      setProfileStep(true)
    } catch(e) {
      setProfileStep(false)
    }
  }

  const openFileDialog = () => {
    if (fileRef.current) fileRef.current.click()
  }

  useEffect(() => {
    const currentClass = classList.find(cl => cl.classId === Number(classId))
    if (currentClass) {
      setInviteStep(currentClass.didInviteClassmates)
      setHide(currentClass.didHideFeedEmptyState)
    }
  }, [classList, classId])

  useEffect(() => {
    if (channels.length > 0) setChatStep(true)
  }, [channels])

  const handleChannelCreated = ({ channel }) => handleRoomClick(channel)
  const handleCreateChannelClose = () => setChannelType(null)
  const handleCreateChannelOpen = () => setChannelType('group')

  const [inviteDialog, setInviteDialog] = useState(false)
  const handleInviteClose = () => setInviteDialog(false)

  const handleInvite = async () => {
    setInviteDialog(true)
    const success = await postEvent({
      sectionId: Number(sectionId),
      category: 'User',
      type: 'Invited'
    })
    if (success) fetchClasses()
  }

  const [moreAnchor, setMoreAnchor] = useState(null)

  const handleMenuOpen = e => setMoreAnchor(e.currentTarget)
  const handleMenuClose = () => setMoreAnchor(null)

  const handleHide = async () => {
    const success = await postEvent({
      sectionId: Number(sectionId),
      category: 'FeedEmptyState',
      type: 'Removed'
    })
    if (success) fetchClasses()
    handleMenuClose()
    setHide(true)
  }

  const header = (
    <Grid container justify='center' classes={{ root: classes.container }} item>
      <Typography variant='h4'>Get Started with CircleIn</Typography>
      {!hide &&
            <IconButton onClick={handleMenuOpen} className={classes.moreIcon}>
              <MoreVertIcon />
            </IconButton>
      }
    </Grid>
  )

  if (hide) return header

  return (
    <Grid
      container
      spacing={4}
      justify='center'
      classes={{
        root: classes.container
      }}
    >
      <MoreMenu
        anchor={moreAnchor}
        handleMenuClose={handleMenuClose}
        handleHide={handleHide}
      />
      <InviteDialog
        handleClose={handleInviteClose}
        open={inviteDialog}
      />
      <CreateChatChannel
        type={channelType}
        client={client}
        channels={channels}
        onClose={handleCreateChannelClose}
        onChannelCreated={handleChannelCreated}
      />
      {header}
      <input accept='image/*' type='file' onChange={handleAddProfilePicture} ref={fileRef} className={classes.hidden} />
      <Grid container justify='center'>
        {!profileStep &&
              <img className={classes.imgFirst} src={EmptyAddProfilePhotoOne} alt='EmptyAddProfilePhotoOne' />}
        {!profileStep &&
        <img className={classes.imgFirst} src={EmptyAddProfilePhotoTwo} alt='EmptyAddProfilePhotoTwo' />}
        {profileStep &&
        <img className={classes.imgSecond} src={CompletedAddProfilePhoto} alt='CompletedAddProfilePhotoTwo' />}
      </Grid>
      <Grid item>
        <Button
          variant='contained'
          onClick={openFileDialog}
          disabled={profileStep}
          startIcon={profileStep && <CheckIcon color='disabled' />}
          color='primary'
          classes={{
            label: classes.buttonLabel
          }}
        >
          {profileStep !== null ? 'Add a Profile Photo' : <CircularProgress color='secondary' size={20} />}
        </Button>
      </Grid>
      <Grid container justify='center'>
        {!inviteStep && <img className={classes.imgSecond} src={EmptyInvite} alt='EmptyInvite' />}
        {inviteStep && <img className={classes.imgSecond} src={CompletedInvite} alt='CompletedInvite' />}
      </Grid>
      <Grid item>
        <Button
          variant='contained'
          disabled={inviteStep}
          startIcon={inviteStep && <CheckIcon color='disabled' />}
          color='primary'
          onClick={handleInvite}
          classes={{
            label: classes.buttonLabel
          }}
        >
          Invite your Classmates
        </Button>
      </Grid>
      <Grid container justify='space-around'>
        {!chatStep && <img className={classes.imgThird} src={EmptyClassGroupChatOne} alt='EmptyClassGroupChatOne' />}
        {!chatStep &&<img className={classes.imgThird} src={EmptyClassGroupChatTwo} alt='EmptyClassGroupChatTwo' />}
        {chatStep &&<img className={classes.imgThird} src={CompletedClassGroupChatOne} alt='CompletedClassGroupChatOne' />}
        {chatStep &&<img className={classes.imgThird} src={CompletedClassGroupChatTwo} alt='CompletedClassGroupChatTwo' />}
      </Grid>
      <Grid item>
        <Button
          variant='contained'
          color='primary'
          disabled={chatStep || !online}
          startIcon={chatStep && <CheckIcon color='disabled' />}
          onClick={handleCreateChannelOpen}
          classes={{
            label: classes.buttonLabel
          }}
        >
          {online ? 'Setup a Class Group Chat' : <CircularProgress color='secondary' size={20} />}
        </Button>
      </Grid>
    </Grid>
  )
}

const mapStateToProps = ({ user, chat, router }: StoreState): {} => ({
  user,
  chat,
  router
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      fetchClasses: userActions.fetchClasses,
      checkUserSession: signInActions.checkUserSession,
      handleRoomClick: chatActions.handleRoomClick,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmptyFeed)
