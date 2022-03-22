import React, { useState, useEffect, useRef, useCallback } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import Popover from '@material-ui/core/Popover';
import Box from '@material-ui/core/Box';
import Avatar from 'components/Avatar';
import { Message, Videocam } from '@material-ui/icons';
import { Typography } from '@material-ui/core';
import { push } from 'connected-react-router';
import cx from 'classnames';
import _ from 'lodash';
import GradientButton from '../Basic/Buttons/GradientButton';
import TransparentButton from '../Basic/Buttons/TransparentButton';
import { getUserProfile } from '../../api/user';
import * as chatActions from '../../actions/chat';
import useStyles from '../_styles/HoverPopup';
import { buildPath } from '../../utils/helpers';
import type { State as StoreState } from '../../types/state';
import { setCurrentCommunityIdAction, setCurrentChannelSidAction } from 'actions/chat';
import { UserState } from '../../reducers/user';
import { Dispatch } from '../../types/store';
import { useChatClient } from 'features/chat';

type Props = {
  leftAligned?: boolean;
  children?: any;
  userId?: any;
  profileSource?: any;
  openChannelWithEntity?: any;
};

const HoverPopup = ({
  leftAligned = false,
  children = null,
  userId,
  profileSource,
  ...props
}: Props) => {
  const classes: any = useStyles();
  const dispatch: Dispatch = useDispatch();

  const myUserId = useSelector((state: { user: UserState }) => state.user.data.userId);

  const client = useChatClient();

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
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      if (userId) {
        const { about, userProfile } = await getUserProfile({
          userId
        });

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
    setOpen(true);
  };

  const mouseEnter = (event) => {
    // TODO Fix consistency: User state in redux and returned from an API is a string,
    if (String(userId) === String(myUserId)) return;
    setHover(true);
    const rect = postFeedItemContainer.current?.getBoundingClientRect();

    if (rect) {
      if (
        rect.top < 0 ||
        rect.left < 0 ||
        rect.bottom + 230 > (window.innerHeight || document.documentElement.clientHeight) ||
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
    if (userId !== myUserId && ((profile as any).firstName || (profile as any).lastName)) {
      setOpen(true);
    }
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
    dispatch(setCurrentCommunityIdAction(null));
    dispatch(setCurrentChannelSidAction(''));
    openChannelWithEntity({
      entityId: Number(userId),
      entityFirstName: (profile as any).firstName,
      entityLastName: (profile as any).lastName,
      entityVideo: false,
      fullscreen: true,
      client
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
      entityFirstName: (profile as any).firstName,
      entityLastName: (profile as any).lastName,
      entityVideo: true,
      fullscreen: true,
      client
    });
    setTimeout(() => {
      setChatLoading(false);
    }, 2000);
  };

  const handleGotoProfile = useCallback(() => {
    dispatch(
      push(
        buildPath(`/profile/${(profile as any).userId}`, {
          from: profileSource
        })
      )
    );
  }, [profile, dispatch, profileSource]);

  const fullName = `${(profile as any).firstName} ${(profile as any).lastName}`;

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
          <div className={classes.hasBio}>
            <Avatar
              profileImage={(profile as any).userProfileUrl}
              handleUserClick={handleGotoProfile}
              fullName={fullName}
              mobileSize={90}
              desktopSize={90}
              onlineBadgeBackground="circleIn.palette.primaryBackground"
              isOnline={(profile as any).isOnline}
            />
            <div className={cx(classes.userInfo, classes.hasBio)}>
              <Typography variant="subtitle1" className={classes.name} onClick={handleGotoProfile}>
                {fullName}
              </Typography>

              {bio && (
                <Typography variant="subtitle1" className={classes.bio}>
                  {bio}
                </Typography>
              )}
            </div>
          </div>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            className={classes.buttonBox}
          >
            <GradientButton startIcon={<Message />} disabled={chatLoading} onClick={onStartChat}>
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

const mapDispatchToProps = (dispatch: any): {} =>
  bindActionCreators(
    {
      openChannelWithEntity: chatActions.openChannelWithEntity
    },
    dispatch
  );

export default connect<{}, {}, Props>(mapStateToProps, mapDispatchToProps)(HoverPopup);

export const ConditionalHoverPopup = ({
  condition,
  wrapper,
  children
}: {
  condition: boolean;
  wrapper: React.ReactElement;
  children: React.ReactChildren;
} & Props) => (condition ? wrapper(children) : children);
