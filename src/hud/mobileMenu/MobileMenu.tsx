import React, { useCallback } from 'react';
import { Box, ButtonBase, Grid } from '@material-ui/core';
import IconChat from '@material-ui/icons/Chat';
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
import { ReactComponent as IconMyClasses } from '../../assets/svg/class-feed-icon-on.svg';
import { ReactComponent as IconAchievements } from '../../assets/svg/leaderboard-icon-on.svg';
import Avatar from '../../components/Avatar/Avatar';
import { User } from '../../types/models';
import { UserState } from '../../reducers/user';
import SemiBoldTypography from '../../components/SemiBoldTypography/SemiBoldTypography';
import useHudRoutes from '../frame/useHudRoutes';

const ICON_SIZE = '25px';
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

  return (
    <Box className={classes.root}>
      <Grid container spacing={4} justifyContent="center" wrap="nowrap" className={classes.menu}>
        {actionItems.map((item) => (
          <Grid item key={item.subId}>
            <ButtonBase onClick={() => handleClickMenu(item.mainId, item.subId)}>
              <Box display="flex" flexDirection="column" alignItems="center">
                {item.icon}
                <SemiBoldTypography>{item.displayName}</SemiBoldTypography>
              </Box>
            </ButtonBase>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MobileMenu;
