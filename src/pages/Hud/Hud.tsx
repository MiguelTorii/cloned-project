import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import cx from 'classnames';
import IconChat from '@material-ui/icons/Chat';
import IconCalendar from '@material-ui/icons/CalendarToday';
import withRoot from '../../withRoot';
import { styles } from './HudStyles';
import GoalsHudItem from '../../hud/goals/GoalsHudItem';
import HudNavbar from '../../hud/navbar/HudNavbar';
import NotesHudItem from '../../hud/notes/NotesHudItem';
import ClassesHudItem from '../../hud/classes/ClassesHudItem';
import CalendarHudItem from '../../hud/calendar/CalendarHudItem';
import ProfileHudItem from '../../hud/profile/ProfileHudItem';
import ChatHudItem from '../../hud/chat/ChatHudItem';
import Chat from '../../containers/MainChat/MainChat';
import MiniWorkflows from '../../containers/MiniWorkflows/MiniWorkflows';
import HudAvatar from '../../containers/Hud/HudAvatar';
import StoryMessage from '../../hud/story/StoryMessage';
import conversations from '../../assets/hud-avatar/conversations';
import useStorySequence from '../../hooks/useStorySequence';
import { ReactComponent as IconClasses } from '../../assets/svg/class-feed-icon-off.svg';
import { ReactComponent as IconNotes } from '../../assets/svg/notes-icon-off.svg';
import { ReactComponent as IconLeaderboard } from '../../assets/svg/leaderboard-icon-off.svg';
import Avatar from '../../components/Avatar/Avatar';
import { AppState } from '../../configureStore';
import { User } from '../../types/models';

type Props = {
  classes: Record<string, any>;
};

const ICON_SIZE = 30;

const CALENDAR_NAV_ITEM_ID = 'calendar';
const CLASSES_NAV_ITEM_ID = 'classes';
const NOTES_NAV_ITEM_ID = 'notes';
const CHAT_NAV_ITEM_ID = 'chat';
const GOALS_NAV_ITEM_ID = 'goals';
const PROFILE_NAV_ITEM_ID = 'profile';

const Hud = ({ classes }: Props) => {
  const profile = useSelector<AppState, User>((state) => state.user.data);
  const navbarItems = [
    {
      id: PROFILE_NAV_ITEM_ID,
      displayName: 'Profile',
      icon: <Avatar src={profile.profileImage} desktopSize={ICON_SIZE} mobileSize={ICON_SIZE} />
    },
    {
      id: CLASSES_NAV_ITEM_ID,
      displayName: 'Classes',
      icon: <IconClasses />
    },
    {
      id: NOTES_NAV_ITEM_ID,
      displayName: 'Study tools',
      icon: <IconNotes />
    },
    {
      id: GOALS_NAV_ITEM_ID,
      displayName: 'Achievements',
      icon: <IconLeaderboard />
    },
    {
      id: CHAT_NAV_ITEM_ID,
      displayName: 'Chat',
      icon: <IconChat />
    },
    {
      id: CALENDAR_NAV_ITEM_ID,
      displayName: 'Calendar',
      icon: <IconCalendar />
    }
  ];

  const [currentNavbarItemId, setCurrentNavbarItemId] = useState<string>(navbarItems[0].id);

  useStorySequence(conversations.crushed);

  return (
    <main>
      <CssBaseline />
      <div className={cx(classes.app, classes.appWithHud)}>
        <div className={classes.mainAction}>
          {currentNavbarItemId === CALENDAR_NAV_ITEM_ID && <CalendarHudItem classes={classes} />}

          {currentNavbarItemId === CLASSES_NAV_ITEM_ID && <ClassesHudItem classes={classes} />}

          {currentNavbarItemId === NOTES_NAV_ITEM_ID && <NotesHudItem classes={classes} />}

          {currentNavbarItemId === CHAT_NAV_ITEM_ID && <Chat />}

          {currentNavbarItemId === GOALS_NAV_ITEM_ID && <GoalsHudItem classes={classes} />}

          {currentNavbarItemId === PROFILE_NAV_ITEM_ID && <ProfileHudItem classes={classes} />}
        </div>
        <div className={classes.storyAvatar}>
          <HudAvatar />
        </div>
        <div className={classes.miniMap} />
        <div className={classes.miniMap} />
        <div className={classes.questTasks}>
          <MiniWorkflows />
        </div>
        <div className={classes.rewardUpdates} />
        <div className={classes.navigation}>
          <HudNavbar
            onSelectItem={setCurrentNavbarItemId}
            navbarItems={navbarItems}
            classes={classes}
          />
        </div>
        <div className={classes.storyCaption}>
          <div className={classes.storyCaptionContent}>
            <StoryMessage classes={classes} />
          </div>
        </div>
        <div className={classes.experienceUpdates} />
        <div className={classes.experienceProgress} />
        <div className={classes.playerModes} />
        <div className={classes.chat}>
          <ChatHudItem />
        </div>
      </div>
    </main>
  );
};

export default withRoot(withStyles(styles as any)(Hud));
