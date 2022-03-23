import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { logEvent } from 'api/analytics';
import { addGroupMembers, createChannel, getGroupMembers } from 'api/chat';
import StudyRoomImg from 'assets/svg/video-chat-image.svg';

import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

import useStyles from './_styles/index';
import StudyRoomInvite from './StudyRoomInvite';

import type { AppState } from 'redux/store';
import type { User, UserClass } from 'types/models';

const StartVideo = () => {
  const classes = useStyles();
  const [inviteVisible, setInviteVisible] = useState(false);
  const [channel, setChannel] = useState('');
  const [groupUsers, setGroupUsers] = useState([]);
  const [online, setOnline] = useState(true);
  const profile = useSelector<AppState, User>((state) => state.user.data);
  const classList = useSelector<AppState, UserClass[]>((state) => state.user.userClasses.classList);

  const handleClose = () => {
    setInviteVisible(false);
  };

  const handleStart = () => {
    if (groupUsers.length <= 1) {
      return;
    }

    logEvent({
      event: 'Video- Start Video',
      props: {
        'Initiated From': 'Video'
      }
    });
    const win = window.open(`/video-call/${channel}`, '_blank');
    win.focus();
  };

  const handleInvite = async ({ chatType, name, type, selectedUsers }) => {
    try {
      const users = selectedUsers.map((item) => Number(item.userId));
      let chatId;

      // Create New study room
      if (!channel) {
        const { chatId: newChatId } = await createChannel({
          users,
          groupName: chatType === 'group' ? name : '',
          type: chatType === 'group' ? type : '',
          thumbnailUrl: chatType === 'group' ? '' : ''
        });
        setChannel(newChatId);
        chatId = newChatId;
      } else {
        // Invite the user to existing chat
        await addGroupMembers({
          chatId: channel,
          users
        });
        chatId = channel;
      }

      const groupUsers = await getGroupMembers(chatId);
      setGroupUsers(groupUsers);
    } catch (e) {}
  };

  const handleSetInviteVisible = () => setInviteVisible(true);

  // Effects
  useEffect(() => {
    const handleOffline = () => {
      console.log('**** offline ****');
      setOnline(false);
    };

    const handleOnline = () => {
      console.log('**** online ****');
      setOnline(true);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return (
    <>
      <ErrorBoundary>
        <div className={classes.root}>
          <div className={classes.row}>
            <Typography variant="h4">Study Room</Typography>
            <Button className={classes.button1} onClick={handleSetInviteVisible}>
              Start a Study Room
            </Button>
          </div>

          <Typography className={classes.subtitle} variant="body1">
            What’s better than studying? Studying with the squad of course! Study with your
            classmates from home. Pants optional. You can earn 20,000 points just for starting a
            study room!
          </Typography>

          <div className={classes.wrapper}>
            <img src={StudyRoomImg} alt="study room chat" />

            <Typography className={classes.note} variant="body1" align="center">
              Get nice and cozy, stay hydrated and press the button below to select classmates to
              join you on a video chat!
            </Typography>

            <Button className={classes.button2} onClick={handleSetInviteVisible}>
              Start a Private Study Room
            </Button>
          </div>
        </div>
      </ErrorBoundary>
      <StudyRoomInvite
        open={inviteVisible}
        userId={profile.userId}
        groupUsers={groupUsers}
        classList={classList}
        handleClose={handleClose}
        handleInvite={handleInvite}
        handleStart={handleStart}
      />
    </>
  );
};

export default StartVideo;
