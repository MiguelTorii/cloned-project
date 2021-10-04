import React, { useEffect, useState, useRef } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CompletedAddProfilePhoto from "assets/svg/completed_add_profile_photo.svg";
import CompletedInvite from "assets/svg/completed_invite.svg";
import CompletedClassGroupChatOne from "assets/svg/completed_class_group_chat_one.svg";
import CompletedClassGroupChatTwo from "assets/svg/completed_class_group_chat_two.svg";
import EmptyAddProfilePhotoOne from "assets/svg/empty_add_profile_photo_one.svg";
import EmptyAddProfilePhotoTwo from "assets/svg/empty_add_profile_photo_two.svg";
import EmptyClassGroupChatOne from "assets/svg/empty_class_group_chat_one.svg";
import EmptyClassGroupChatTwo from "assets/svg/empty_class_group_chat_two.svg";
import EmptyInvite from "assets/svg/empty_invite.svg";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as chatActions from "actions/chat";
import type { UserState } from "reducers/user";
import type { ChatState } from "reducers/chat";
import type { State as StoreState } from "types/state";
import { updateUserProfileUrl } from "api/user";
import { getPresignedURL } from "api/media";
import axios from "axios";
import CheckIcon from "@material-ui/icons/Check";
import CircularProgress from "@material-ui/core/CircularProgress";
import CreateChatChannel from "containers/CreateChatChannel/CreateChatChannel";
import * as signInActions from "actions/sign-in";
import * as userActions from "actions/user";
import InviteDialog from "components/InviteDialog/InviteDialog";
import MoreMenu from "components/FeedList/EmptyFeed/MoreMenu";
import { postEvent } from "api/feed";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";
import cx from "classnames";
import Paper from "@material-ui/core/Paper";
import { useStyles } from "../_styles/FeedList/EmptyFeed";
type Props = {
  user: UserState;
  chat: ChatState;
  router: Record<string, any>;
  handleRoomClick: (...args: Array<any>) => any;
  feed: Record<string, any>;
  checkUserSession: (...args: Array<any>) => any;
  fetchClasses: (...args: Array<any>) => any;
};

const EmptyFeed = ({
  user,
  chat,
  router,
  feed,
  checkUserSession,
  handleRoomClick,
  fetchClasses
}: Props) => {
  const classes = useStyles();
  const {
    userClasses: {
      classList
    },
    data: {
      userId,
      profileImage
    }
  } = user;
  const {
    data: {
      items
    }
  } = feed;
  const {
    data: {
      client,
      channels,
      online
    }
  } = chat;
  const {
    location: {
      query: {
        sectionId,
        classId
      }
    }
  } = router;
  const [hide, setHide] = useState(false);
  const [remove, setRemove] = useState(false);
  const [profileStep, setProfileStep] = useState(profileImage !== '');
  const [channelType, setChannelType] = useState(null);
  const [inviteStep, setInviteStep] = useState(false);
  const [chatStep, setChatStep] = useState(false);
  const fileRef = useRef(null);

  const handleAddProfilePicture = async () => {
    setProfileStep(null);

    try {
      const file = fileRef.current.files[0];
      const result = await getPresignedURL({
        userId,
        type: 2,
        mediaType: file.type
      });
      const {
        mediaId,
        url
      } = result;
      await axios.put(url, file, {
        headers: {
          'Content-Type': file.type
        }
      });
      await updateUserProfileUrl({
        userId,
        mediaId
      });
      checkUserSession();
      setProfileStep(true);
    } catch (e) {
      setProfileStep(false);
    }
  };

  const openFileDialog = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  useEffect(() => {
    const currentClass = classList.find(cl => cl.classId === Number(classId));

    if (currentClass) {
      setInviteStep(currentClass.didInviteClassmates);
      setRemove(currentClass.didHideFeedEmptyState);
    }
  }, [classList, classId]);
  useEffect(() => {
    if (channels.length > 0) {
      setChatStep(true);
    }
  }, [channels]);
  useEffect(() => {
    if (items.length > 0) {
      setHide(true);
    } else {
      setHide(false);
    }
  }, [items]);

  const handleChannelCreated = ({
    channel
  }) => handleRoomClick(channel);

  const handleCreateChannelClose = () => setChannelType(null);

  const handleCreateChannelOpen = () => setChannelType('group');

  const [inviteDialog, setInviteDialog] = useState(false);

  const handleInviteClose = () => setInviteDialog(false);

  const handleInvite = async () => {
    setInviteDialog(true);
    const success = await postEvent({
      sectionId: Number(sectionId),
      category: 'User',
      type: 'Invited'
    });

    if (success) {
      fetchClasses();
    }
  };

  const [moreAnchor, setMoreAnchor] = useState(null);

  const handleMenuOpen = e => setMoreAnchor(e.currentTarget);

  const handleMenuClose = () => setMoreAnchor(null);

  const toggleHide = () => {
    handleMenuClose();
    setHide(!hide);
  };

  const handleRemove = async () => {
    const success = await postEvent({
      sectionId: Number(sectionId),
      category: 'FeedEmptyState',
      type: 'Removed'
    });

    if (success) {
      fetchClasses();
    }

    handleMenuClose();
    setRemove(true);
  };

  const header = <Paper className={cx(classes.root, classes.marginBottom, classes.container)} elevation={0}>
      <Grid container justifyContent="center" classes={{
      root: classes.container
    }} item>
        <MoreMenu anchor={moreAnchor} handleMenuClose={handleMenuClose} completed={profileStep && inviteStep && chatStep} handleRemove={handleRemove} hide={hide} toggleHide={toggleHide} />
        <Typography variant="h4">Get Started with CircleIn</Typography>
        <IconButton onClick={handleMenuOpen} className={classes.moreIcon}>
          <MoreVertIcon />
        </IconButton>
      </Grid>
    </Paper>;

  if (remove) {
    return null;
  }

  if (hide) {
    return header;
  }

  return <Paper className={cx(classes.root, classes.marginBottom)} elevation={0}>
      <Grid container spacing={4} justifyContent="center" classes={{
      root: classes.container
    }}>
        <InviteDialog handleClose={handleInviteClose} open={inviteDialog} />
        <CreateChatChannel type={channelType} client={client} channels={channels} onClose={handleCreateChannelClose} onChannelCreated={handleChannelCreated} />
        {header}
        <input accept="image/*" type="file" onChange={handleAddProfilePicture} ref={fileRef} className={classes.hidden} />
        <Grid container justifyContent="center">
          {!profileStep && <img className={classes.imgFirst} src={EmptyAddProfilePhotoOne} alt="EmptyAddProfilePhotoOne" />}
          {!profileStep && <img className={classes.imgFirst} src={EmptyAddProfilePhotoTwo} alt="EmptyAddProfilePhotoTwo" />}
          {profileStep && <img className={classes.imgSecond} src={CompletedAddProfilePhoto} alt="CompletedAddProfilePhotoTwo" />}
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={openFileDialog} disabled={profileStep} startIcon={profileStep && <CheckIcon color="disabled" />} color="primary" classes={{
          label: classes.buttonLabel
        }}>
            {profileStep !== null ? 'Add a Profile Photo' : <CircularProgress color="secondary" size={20} />}
          </Button>
        </Grid>
        <Grid container justifyContent="center">
          {!inviteStep && <img className={classes.imgSecond} src={EmptyInvite} alt="EmptyInvite" />}
          {inviteStep && <img className={classes.imgSecond} src={CompletedInvite} alt="CompletedInvite" />}
        </Grid>
        <Grid item>
          <Button variant="contained" disabled={inviteStep} startIcon={inviteStep && <CheckIcon color="disabled" />} color="primary" onClick={handleInvite} classes={{
          label: classes.buttonLabel
        }}>
            Invite your Classmates
          </Button>
        </Grid>
        <Grid container justifyContent="space-around">
          {!chatStep && <img className={classes.imgThird} src={EmptyClassGroupChatOne} alt="EmptyClassGroupChatOne" />}
          {!chatStep && <img className={classes.imgThird} src={EmptyClassGroupChatTwo} alt="EmptyClassGroupChatTwo" />}
          {chatStep && <img className={classes.imgThird} src={CompletedClassGroupChatOne} alt="CompletedClassGroupChatOne" />}
          {chatStep && <img className={classes.imgThird} src={CompletedClassGroupChatTwo} alt="CompletedClassGroupChatTwo" />}
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" disabled={chatStep || !online} startIcon={chatStep && <CheckIcon color="disabled" />} onClick={handleCreateChannelOpen} classes={{
          label: classes.buttonLabel
        }}>
            {online ? 'Setup a Class Group Chat' : <CircularProgress color="secondary" size={20} />}
          </Button>
        </Grid>
      </Grid>
    </Paper>;
};

const mapStateToProps = ({
  feed,
  user,
  chat,
  router
}: StoreState): {} => ({
  user,
  chat,
  feed,
  router
});

const mapDispatchToProps = (dispatch: any): {} => bindActionCreators({
  fetchClasses: userActions.fetchClasses,
  checkUserSession: signInActions.checkUserSession,
  handleRoomClick: chatActions.handleRoomClick
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EmptyFeed);