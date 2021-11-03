import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import cx from 'classnames';
import withRoot from '../../withRoot';
import { styles } from '../../components/_styles/Hud/Hud';
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

type Props = {
  classes: Record<string, any>;
};

const CALENDAR_NAV_ITEM_ID = 'calendar';
const CLASSES_NAV_ITEM_ID = 'classes';
const NOTES_NAV_ITEM_ID = 'notes';
const CHAT_NAV_ITEM_ID = 'chat';
const GOALS_NAV_ITEM_ID = 'goals';
const PROFILE_NAV_ITEM_ID = 'profile';

const Hud = ({ classes }: Props) => {
  const navbarItems = [
    {
      id: CALENDAR_NAV_ITEM_ID,
      displayName: 'Calendar'
    },
    {
      id: CLASSES_NAV_ITEM_ID,
      displayName: 'Classes'
    },
    {
      id: NOTES_NAV_ITEM_ID,
      displayName: 'Notes'
    },
    {
      id: CHAT_NAV_ITEM_ID,
      displayName: 'Chat'
    },
    {
      id: GOALS_NAV_ITEM_ID,
      displayName: 'Goals'
    },
    {
      id: PROFILE_NAV_ITEM_ID,
      displayName: 'Profile'
    }
  ];

  const [currentNavbarItemId, setCurrentNavbarItemId] = useState<string>(navbarItems[0].id);

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
        <div className={classes.miniMap}>
          <HudNavbar
            onSelectItem={setCurrentNavbarItemId}
            navbarItems={navbarItems}
            classes={classes}
          />
        </div>
        <div className={classes.questTasks}>
          <MiniWorkflows />
        </div>
        <div className={classes.rewardUpdates} />
        <div className={classes.toolsAndSpells} />
        <div className={classes.storyCaption}>
          <div className={classes.storyCaptionContent}>
            {`Hello, I'm Kobe. Welcome to CircleIn!`}
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
