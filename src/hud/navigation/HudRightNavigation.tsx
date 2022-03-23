import React, { useCallback, useState } from 'react';

import { push } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';

import { Badge } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';

import { POST_TYPES } from 'constants/app';
import { PERMISSIONS } from 'constants/common';

import { ReactComponent as IconSubmitAnIdea } from 'assets/svg/ic_feedback.svg';
import { ReactComponent as IconMobileApp } from 'assets/svg/ic_get_mobile_app.svg';
import { ReactComponent as IconExpertModeToggle } from 'assets/svg/ic_go_to_expert_mode.svg';
import { ReactComponent as IconSignOut } from 'assets/svg/ic_logout.svg';
import { ReactComponent as IconPointsHistory } from 'assets/svg/ic_points_history.svg';
import { ReactComponent as IconAboutMe } from 'assets/svg/ic_profile.svg';
import { ReactComponent as IconSupport } from 'assets/svg/ic_support.svg';
import { ReactComponent as IconInvite } from 'assets/svg/invite-icon.svg';
import Avatar from 'components/Avatar';
import Notifications from 'containers/Notifications/Feed';
import useCampaigns from 'hooks/useCampaigns';
import {
  ABOUT_ME_AREA,
  NOTIFICATIONS_AREA,
  GIVE_FEEDBACK_AREA,
  POINTS_HISTORY_AREA,
  PROFILE_MAIN_AREA,
  SIGN_OUT_BUTTON,
  SUPPORT_AREA,
  GET_THE_MOBILE_APP_AREA,
  EXPERT_MODE_ACCESS,
  RIGHT_SIDE_AREA,
  INVITE_FRIENDS_AREA
} from 'hud/navigationState/hudNavigation';

import { useStyles } from './HudNavigationStyles';
import HudTool from './HudTool';
import HudToolWithDropdown from './HudToolWithDropdown';

import type { HudNavigationState } from '../navigationState/hudNavigationState';
import type { HudToolData } from './HudToolData';
import type { UserState } from 'reducers/user';
import type { Action, Dispatch } from 'redux';
import type { User } from 'types/models';

const ICON_SIZE = 30;

const HudRightNavigation = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const classes: any = useStyles();
  const dispatch: Dispatch<Action> = useDispatch();

  const isExpertMode: boolean = useSelector((state: { user: UserState }) => state.user.expertMode);
  const profile: User = useSelector((state: { user: UserState }) => state.user.data);
  const { isInviteFriendsActive } = useCampaigns();

  const hasExpertModeFunctionality =
    profile.permission.includes(PERMISSIONS.EXPERT_MODE_ACCESS) &&
    profile.permission.includes(PERMISSIONS.MAIN_APPLICATION_ACCESS);

  const isOnlyAnExpert =
    profile.permission.includes(PERMISSIONS.EXPERT_MODE_ACCESS) &&
    profile.permission.indexOf(PERMISSIONS.MAIN_APPLICATION_ACCESS) === -1;

  const isVisible: boolean = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.sideAreaToIsVisible[RIGHT_SIDE_AREA]
  );

  const expertNavigationItem = {
    id: EXPERT_MODE_ACCESS,
    displayName: !isExpertMode ? 'Go to Expert Mode' : 'Go to Student Mode',
    icon: <IconExpertModeToggle />
  };

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
      id: GIVE_FEEDBACK_AREA,
      displayName: 'Give Feedback',
      icon: <IconSubmitAnIdea />
    },
    {
      id: SUPPORT_AREA,
      displayName: 'CircleIn Support',
      icon: <IconSupport />
    },
    {
      id: GET_THE_MOBILE_APP_AREA,
      displayName: 'Get the Mobile App',
      icon: <IconMobileApp />
    }
  ];

  if (isInviteFriendsActive) {
    profileNavigationItems.push({
      id: INVITE_FRIENDS_AREA,
      displayName: 'Invite Friends',
      icon: <IconInvite />
    });
  }

  if (hasExpertModeFunctionality) {
    profileNavigationItems.push(expertNavigationItem);
  }
  profileNavigationItems.push({
    id: SIGN_OUT_BUTTON,
    displayName: 'Sign Out',
    icon: <IconSignOut />
  });

  const fullName = `${profile.firstName} ${profile.lastName}`;

  const profilePicture = (
    <Avatar
      fullName={fullName}
      profileImage={profile.profileImage}
      desktopSize={ICON_SIZE}
      mobileSize={ICON_SIZE}
    />
  );

  const profileNavigationItem: HudToolData = {
    id: PROFILE_MAIN_AREA,
    displayName: 'Profile',
    icon: profilePicture,
    childTools: profileNavigationItems,
    showIconOnly: true,
    tooltip: true,
    isCompact: true
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

        case POST_TYPES.POST:
          dispatch(push(`/post/${postId}`));
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
