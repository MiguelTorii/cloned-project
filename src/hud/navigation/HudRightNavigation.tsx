import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Action, Dispatch } from 'redux';
import { CalendarToday } from '@material-ui/icons';
import { useStyles } from './HudNavigationStyles';
import { HudNavigationState } from '../navigationState/hudNavigationState';
import {
  ABOUT_ME_AREA,
  POINTS_HISTORY_AREA,
  PROFILE_MAIN_AREA,
  REWARDS_STORE_AREA,
  RIGHT_SIDE_AREA,
  SIGN_OUT_BUTTON
} from '../navigationState/hudNavigation';
import { UserState } from '../../reducers/user';
import HudToolWithDropdown from './HudToolWithDropdown';
import { HudToolData } from './HudToolData';
import { ReactComponent as IconAboutMe } from '../../assets/svg/about_me.svg';
import { ReactComponent as IconPointsHistory } from '../../assets/svg/points_history.svg';
import { ReactComponent as IconRewardStore } from '../../assets/svg/rewards-icon-off.svg';
import Avatar from '../../components/Avatar/Avatar';
import { User } from '../../types/models';
import HudTool from './HudTool';
import { toggleSideAreaVisibility } from '../navigationState/hudNavigationActions';

const ICON_SIZE = 30;

const HudRightNavigation = () => {
  const classes: any = useStyles();

  const dispatch: Dispatch<Action> = useDispatch();

  // TODO show icon state
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
      id: SIGN_OUT_BUTTON,
      displayName: 'Sign Out'
      // icon: <IconRewardStore />
    }
  ];

  const profileNavigationItem: HudToolData = {
    id: PROFILE_MAIN_AREA,
    displayName: 'Profile',
    icon: <Avatar src={profile.profileImage} desktopSize={ICON_SIZE} mobileSize={ICON_SIZE} />,
    childTools: profileNavigationItems,
    showIconOnly: true
  };

  const missionNavigationItem = {
    id: RIGHT_SIDE_AREA,
    displayName: 'Missions',
    icon: <CalendarToday />
  };

  const selectSideItem = () => {
    dispatch(toggleSideAreaVisibility(RIGHT_SIDE_AREA));
  };

  return (
    <div className={classes.controlPanelMainSection}>
      <HudTool
        onSelectItem={selectSideItem}
        navbarItem={missionNavigationItem}
        isSelected={isVisible}
      />
      <HudToolWithDropdown parentNavigationItem={profileNavigationItem} />
    </div>
  );
};

export default HudRightNavigation;
