import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Action, Dispatch } from 'redux';
import { CalendarToday } from '@material-ui/icons';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { push } from 'connected-react-router';
import { Badge, Typography, IconButton } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import { useStyles } from './HudNavigationStyles';
import { HudNavigationState } from '../navigationState/hudNavigationState';
import {
  ABOUT_ME_AREA,
  NOTIFICATIONS_AREA,
  GIVE_FEEDBACK_AREA,
  POINTS_HISTORY_AREA,
  PROFILE_MAIN_AREA,
  REWARDS_STORE_AREA,
  RIGHT_SIDE_AREA,
  SIGN_OUT_BUTTON,
  SUPPORT_AREA
} from '../navigationState/hudNavigation';
import { UserState } from '../../reducers/user';
import HudToolWithDropdown from './HudToolWithDropdown';
import { HudToolData } from './HudToolData';
import { ReactComponent as IconAboutMe } from '../../assets/svg/about_me.svg';
import { ReactComponent as IconPointsHistory } from '../../assets/svg/points_history.svg';
import { ReactComponent as IconRewardStore } from '../../assets/svg/rewards-icon-off.svg';
import { ReactComponent as IconSubmitAnIdea } from '../../assets/svg/submit_an_idea.svg';
import Avatar from '../../components/Avatar/Avatar';
import { User } from '../../types/models';
import HudTool from './HudTool';
import { toggleSideAreaVisibility } from '../navigationState/hudNavigationActions';
import Notifications from '../../containers/Notifications/Feed';
import { POST_TYPES } from '../../constants/app';
import { getInitials } from '../../utils/chat';

const ICON_SIZE = '30px';

const HudRightNavigation = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const classes: any = useStyles();

  const dispatch: Dispatch<Action> = useDispatch();

  const isVisible: boolean = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.sideAreaToIsVisible[RIGHT_SIDE_AREA]
  );

  const profile: User = useSelector((state: { user: UserState }) => state.user.data);

  const profileNavigationItems: HudToolData[] = [
    {
      id: ABOUT_ME_AREA,
      displayName: 'About Me',
      icon: <IconAboutMe />
    },
    {
      id: POINTS_HISTORY_AREA,
      displayName: 'Points History',
      icon: <IconPointsHistory />
    },
    {
      id: REWARDS_STORE_AREA,
      displayName: 'Rewards Store',
      icon: <IconRewardStore />
    },
    {
      id: GIVE_FEEDBACK_AREA,
      displayName: 'Give Feedback',
      icon: <IconSubmitAnIdea />
    },
    {
      id: SUPPORT_AREA,
      displayName: 'CircleIn Support',
      icon: <HelpIcon />
    },
    {
      id: SIGN_OUT_BUTTON,
      displayName: 'Sign Out'
    }
  ];

  const initials = getInitials(`${profile.firstName} ${profile.lastName}`);

  const profilePicture = profile.profileImage ? (
    <div className={classes.profileBackground}>
      <Avatar src={profile.profileImage} desktopSize={ICON_SIZE} mobileSize={ICON_SIZE} />
    </div>
  ) : (
    <div className={classes.profileBackground}>
      <Typography className={classes.initials}>{initials}</Typography>
    </div>
  );

  const profileNavigationItem: HudToolData = {
    id: PROFILE_MAIN_AREA,
    displayName: 'Profile',
    icon: profilePicture,
    childTools: profileNavigationItems,
    showIconOnly: true,
    tooltip: true
  };

  const missionNavigationItem = {
    id: RIGHT_SIDE_AREA,
    displayName: 'Upcoming tasks',
    icon: <CalendarToday />
  };

  const notificationNavigationItem = {
    id: NOTIFICATIONS_AREA,
    displayName: 'Notifications',
    icon: (
      <Badge badgeContent={notificationCount} color="secondary">
        <NotificationsIcon />
      </Badge>
    )
  };

  const selectSideItem = () => {
    dispatch(toggleSideAreaVisibility(RIGHT_SIDE_AREA));
  };

  const handleOpenNotifications = (_, e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorEl(null);
  };

  const handleUpdateNotificationsCount = (count) => {
    setNotificationCount(count);
  };

  const handleNotificationClick = useCallback(
    ({ typeId, postId }: { typeId: number; postId: number }) => {
      switch (typeId) {
        case POST_TYPES.FLASHCARDS:
          dispatch(push(`/flashcards/${postId}`));
          break;

        case POST_TYPES.NOTE:
          dispatch(push(`/notes/${postId}`));
          break;

        case POST_TYPES.LINK:
          dispatch(push(`/sharelink/${postId}`));
          break;

        case POST_TYPES.QUESTION:
          dispatch(push(`/question/${postId}`));
          break;

        default:
          break;
      }
    },
    [dispatch]
  );

  return (
    <div className={classes.controlPanelMainSection}>
      <HudTool
        onSelectItem={selectSideItem}
        navbarItem={missionNavigationItem}
        isSelected={isVisible}
      />
      <HudTool
        navbarItem={notificationNavigationItem}
        onSelectItem={handleOpenNotifications}
        isSelected={false}
      />
      <HudToolWithDropdown profile={profile} parentNavigationItem={profileNavigationItem} />
      <Notifications
        anchorEl={anchorEl}
        onClose={handleCloseNotifications}
        onUpdateUnreadCount={handleUpdateNotificationsCount}
        onClick={handleNotificationClick}
      />
    </div>
  );
};

export default HudRightNavigation;
