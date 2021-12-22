import React, { useCallback } from 'react';
import { Box, ButtonBase, Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
import useStyles from './MobileMenuStyles';
import {
  ABOUT_ME_AREA,
  ACHIEVEMENTS_MAIN_AREA,
  CHAT_AREA,
  CHAT_MAIN_AREA,
  CLASSES_AREA,
  COMMUNITIES_MAIN_AREA,
  LEADERBOARD_AREA,
  PROFILE_MAIN_AREA
} from '../navigationState/hudNavigation';
import { ReactComponent as IconChat } from '../../assets/svg/ic_nav_chat.svg';
import { ReactComponent as IconMyClasses } from '../../assets/svg/ic_nav_classes.svg';
import { ReactComponent as IconAchievements } from '../../assets/svg/ic_nav_leaderboard.svg';
import Avatar from '../../components/Avatar/Avatar';
import { User } from '../../types/models';
import { UserState } from '../../reducers/user';
import SemiBoldTypography from '../../components/SemiBoldTypography/SemiBoldTypography';
import useHudRoutes from '../frame/useHudRoutes';

const ICON_SIZE = '35px';
const ICON_STYLES = { width: ICON_SIZE, height: ICON_SIZE };

const MobileMenu = () => {
  const classes = useStyles();
  const profile: User = useSelector((state: { user: UserState }) => state.user.data);
  const setHudArea = useHudRoutes();

  const actionItems = [
    {
      mainId: CHAT_MAIN_AREA,
      subId: CHAT_AREA,
      displayName: 'Chat',
      icon: <IconChat style={ICON_STYLES} />
    },
    {
      mainId: COMMUNITIES_MAIN_AREA,
      subId: CLASSES_AREA,
      displayName: 'Classes',
      icon: <IconMyClasses style={ICON_STYLES} />
    },
    {
      mainId: ACHIEVEMENTS_MAIN_AREA,
      subId: LEADERBOARD_AREA,
      displayName: 'Leaderboard',
      icon: <IconAchievements style={ICON_STYLES} />
    }
  ];

  const handleClickMenu = useCallback(
    (mainId, subId) => {
      setHudArea(mainId, subId);
    },
    [setHudArea]
  );

  const navbarItemClass = (parentNavId: string) => {
    switch (parentNavId) {
      case COMMUNITIES_MAIN_AREA:
        return classes.navbarClasses;
      case ACHIEVEMENTS_MAIN_AREA:
        return classes.navbarLeaderboard;
      case CHAT_MAIN_AREA:
        return classes.navbarChat;
      default:
        return null;
    }
  };

  return (
    <Box className={classes.root}>
      <div className={classes.mobileNavMenu}>
        {actionItems.map((item) => (
          <div key={item.subId}>
            <ButtonBase
              className={classes.mobileNavItem}
              onClick={() => handleClickMenu(item.mainId, item.subId)}
            >
              <Box display="flex" flexDirection="column" alignItems="center">
                {item.icon}
                <SemiBoldTypography className={navbarItemClass(item.mainId)}>
                  {item.displayName}
                </SemiBoldTypography>
              </Box>
            </ButtonBase>
          </div>
        ))}
      </div>
    </Box>
  );
};

export default MobileMenu;
