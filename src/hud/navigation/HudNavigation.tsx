import React from 'react';
import IconChat from '@material-ui/icons/Chat';
import IconCalendar from '@material-ui/icons/CalendarToday';
import { ReactComponent as IconClasses } from '../../assets/svg/class-feed-icon-off.svg';
// import IconClasses from '../../assets/svg/class-feed-icon-off.svg';
import { ReactComponent as IconNotes } from '../../assets/svg/notes-icon-off.svg';
import { ReactComponent as IconLeaderboard } from '../../assets/svg/leaderboard-icon-off.svg';
import Avatar from '../../components/Avatar/Avatar';
import { User } from '../../types/models';
// import { useStyles } from './HudNavigationStyles';

const ICON_SIZE = 30;

export const WORKFLOW_SUBAREA_ID = 'calendar';
export const COMMUNITIES_AREA_ID = 'classes';
export const STUDY_TOOLS_AREA_ID = 'notebook';
export const CHAT_AREA_ID = 'chat';
export const ACHIEVEMENTS_AREA_ID = 'awards';
export const PROFILE_AREA_ID = 'profile';

const rootNavigation = (profile: User) =>
  // TODO add this to make the icons all the same size.
  // const classes: any = useStyles();

  [
    {
      id: PROFILE_AREA_ID,
      displayName: 'Profile',
      icon: <Avatar src={profile.profileImage} desktopSize={ICON_SIZE} mobileSize={ICON_SIZE} />
    },
    {
      id: COMMUNITIES_AREA_ID,
      displayName: 'Classes',
      icon: <IconClasses />
      // icon: <img className={classes.navigationIcon} src={IconClasses} alt="Communities" />
    },
    {
      id: STUDY_TOOLS_AREA_ID,
      displayName: 'Study tools',
      icon: <IconNotes />
    },
    {
      id: ACHIEVEMENTS_AREA_ID,
      displayName: 'Awards',
      icon: <IconLeaderboard />
    },
    {
      id: WORKFLOW_SUBAREA_ID,
      displayName: 'Calendar',
      icon: <IconCalendar />
    },
    {
      id: CHAT_AREA_ID,
      displayName: 'Chat',
      icon: <IconChat />
    }
  ];
export default rootNavigation;
