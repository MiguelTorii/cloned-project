// @flow
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import Popover from '@material-ui/core/Popover';

import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import { Message, Videocam } from '@material-ui/icons';

import OnlineBadge from 'components/OnlineBadge/OnlineBadge';
import GradientButton from 'components/Basic/Buttons/GradientButton';
import TransparentButton from 'components/Basic/Buttons/TransparentButton';

import { getInitials } from 'utils/chat';
import { Typography } from '@material-ui/core';
import { push } from 'connected-react-router';

import cx from 'classnames';
import _ from 'lodash';
import { getUserProfile } from '../../api/user';
import * as chatActions from '../../actions/chat';

import useStyles from '../_styles/HoverPopup';

const HoverPopup = ({
  leftAligned = false,
  children = null,
  userId,
  setCurrentCommunityId,
  setCurrentChannel,
  setCurrentCommunity,
  setCurrentChannelSid,
  ...props
}) => {
  const classes = useStyles();
  const myUserId = useSelector((state) => state.user.data.userId);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [outOfScreen, setOutOfScreen] = useState(false);
  const [bio, setBio] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const popoverContainer = useRef(null);
  const postFeedItemContainer = useRef(null);
  const [profile, setProfile] = useState({});

  const fetchUserInfo = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (userId) {
        const { about, userProfile } = await getUserProfile({ userId });
        const idx = _.findIndex(about, (item) => item.id === 6);
        const userbio = idx < 0 ? null : about[idx].answer;
        setBio(userbio);
        setProfile(userProfile);
      }
      setIsLoading(false);
    } catch (e) {}
  };

  const handlePopoverOpen = (event) => {
    fetchUserInfo();
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setOpen(false);
  };

  const keepPopoverOpen = () => {
    if (userId !== myUserId) setOpen(true);
  };

  const mouseEnter = (event) => {
    setHover(true);
    const rect = postFeedItemContainer.current?.getBoundingClientRect();
    if (rect) {
      if (
        rect.top < 0 ||
        rect.left < 0 ||
        rect.bottom + 230 >
          (window.innerHeight || document.documentElement.clientHeight) ||
        rect.right < 0
      ) {
        setOutOfScreen(true);
      } else {
        setOutOfScreen(false);
      }
    }
    handlePopoverOpen(event);
  };

  const mouseLeave = () => {
    setHover(false);
    handlePopoverClose();
  };

  const onTimeout = useCallback(() => {
    if (userId !== myUserId && (profile.firstName || profile.lastName))
      setOpen(true);
  }, [userId, myUserId, profile]);

  useEffect(() => {
    const timer = hover && setTimeout(onTimeout, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [hover, onTimeout]);

  const onStartChat = async (event) => {
    event.stopPropagation();
    const { openChannelWithEntity } = props;
    setChatLoading(true);
    setCurrentCommunityId(null);
    setCurrentChannelSid('');
    setCurrentChannel(null);

    openChannelWithEntity({
      entityId: Number(userId),
      entityFirstName: profile.firstName,
      entityLastName: profile.lastName,
      entityVideo: false,
      fullscreen: true
    });
    setTimeout(() => {
      setChatLoading(false);
    }, 2000);
  };

  const onStartVideo = () => {
    const { openChannelWithEntity } = props;

    setChatLoading(true);
    openChannelWithEntity({
      entityId: Number(userId),
      entityFirstName: profile.firstName,
      entityLastName: profile.lastName,
      entityVideo: true,
      fullscreen: true
    });
    setTimeout(() => {
      setChatLoading(false);
    }, 2000);
  };

  const handleGotoProfile = useCallback(() => {
    dispatch(push(`/profile/${profile.userId}`));
  }, [profile, dispatch]);

  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <>
      <div
        aria-owns={open ? 'mouse-over-popover' : ''}
        id="hoverPopup"
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
        className={classes.root}
        ref={postFeedItemContainer}
      >
        {children}
      </div>
      <div ref={popoverContainer}>
        <Popover
          id="mouse-over-popover"
          className={classes.popover}
          classes={{
            paper: cx(classes.paper, outOfScreen && 'flip')
          }}
          open={open && !isLoading}
          anchorEl={anchorEl}
          // container={anchorEl}
          anchorOrigin={{
            vertical: outOfScreen ? 'bottom' : 'top',
            horizontal: leftAligned ? 'left' : 'left'
          }}
          transformOrigin={{
            vertical: outOfScreen ? 'bottom' : 'top',
            horizontal: leftAligned ? 'left' : 'right'
          }}
          PaperProps={{
            onMouseEnter: keepPopoverOpen,
            onMouseLeave: handlePopoverClose
          }}
          onClose={handlePopoverClose}
          getContentAnchorEl={null}
          disableRestoreFocus
        >
          {/* <div className={classes.overviewContainer}> */}
          <div className={classes.hasBio}>
            <OnlineBadge
              isOnline={profile.isOnline}
              bgColorPath="circleIn.palette.primaryBackground"
              fromChat={false}
            >
              <Avatar
                alt={fullName}
                src={profile.userProfileUrl}
                className={classes.overviewAvatar}
              >
                {getInitials(fullName)}
              </Avatar>
            </OnlineBadge>
            <div className={cx(classes.userInfo, classes.hasBio)}>
              <Typography
                variant="subtitle1"
                className={classes.name}
                onClick={handleGotoProfile}
              >
                {fullName}
              </Typography>

              {bio && (
                <Typography variant="subtitle1" className={classes.bio}>
                  {bio}
                </Typography>
              )}
            </div>
          </div>
          {/*
            <Typography
              variant="subtitle1"
              className={classes.subTitle}
            >{"Classes you have together"}
            </Typography> */}

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            className={classes.buttonBox}
          >
            <GradientButton
              startIcon={<Message />}
              disabled={chatLoading}
              onClick={onStartChat}
            >
              Message
            </GradientButton>
            <TransparentButton
              startIcon={<Videocam />}
              disabled={chatLoading}
              onClick={onStartVideo}
            >
              Study Room
            </TransparentButton>
          </Box>
        </Popover>
      </div>
    </>
  );
};

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      openChannelWithEntity: chatActions.openChannelWithEntity,
      setCurrentCommunityId: chatActions.setCurrentCommunityId,
      setCurrentChannel: chatActions.setCurrentChannel,
      setCurrentChannelSid: chatActions.setCurrentChannelSid,
      setCurrentCommunity: chatActions.setCurrentCommunity
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(HoverPopup);
