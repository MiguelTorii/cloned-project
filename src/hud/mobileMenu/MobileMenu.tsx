import clsx from 'clsx';

import Box from '@material-ui/core/Box';
import ButtonBase from '@material-ui/core/ButtonBase';

import { ReactComponent as IconChat } from 'assets/svg/ic_nav_chat.svg';
import { ReactComponent as IconMyClasses } from 'assets/svg/ic_nav_classes.svg';
import { ReactComponent as IconAchievements } from 'assets/svg/ic_nav_leaderboard.svg';
import SemiBoldTypography from 'components/SemiBoldTypography/SemiBoldTypography';
import useHudAreaSetter from 'hud/frame/useHudRoutes';
import { useStyles as useNavigationStyles } from 'hud/navigation/HudNavigationStyles';
import {
  ACHIEVEMENTS_MAIN_AREA,
  CHAT_AREA,
  CHAT_MAIN_AREA,
  CLASSES_AREA,
  COMMUNITIES_MAIN_AREA,
  LEADERBOARD_AREA
} from 'hud/navigationState/hudNavigation';
import { useAppSelector } from 'redux/store';

const ICON_SIZE = '35px';
const ICON_STYLES = { width: ICON_SIZE, height: ICON_SIZE };

const MobileMenu = () => {
  const classes = useNavigationStyles();
  const setHudArea = useHudAreaSetter();

  const selectedMainArea = useAppSelector((state) => state.hudNavigation.selectedMainArea);

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
    <Box className={classes.mobileRoot}>
      <div className={classes.mobileNavMenu}>
        {actionItems.map((item) => (
          <div key={item.subId}>
            <ButtonBase
              className={clsx(
                classes.mobileNavItem,
                selectedMainArea === item.mainId && classes.selectedButton
              )}
              onClick={() => setHudArea(item.mainId, item.subId)}
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
