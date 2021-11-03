import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import cx from 'classnames';
import withRoot from '../../withRoot';
import { styles } from '../../components/_styles/Hud/Hud';
import GoalsHudItem from '../../hud/goals/GoalsHudItem';
import MainActionNavbar from '../../hud/navbar/HudNavbar';
import NotesHudItem from '../../hud/notes/NotesHudItem';
import ClassesHudItem from '../../hud/classes/ClassesHudItem';
import CalendarHudItem from '../../hud/calendar/CalendarHudItem';
import ProfileHudItem from '../../hud/profile/ProfileHudItem';
import ChatHudItem from '../../hud/chat/ChatHudItem';
import Chat from '../../containers/MainChat/MainChat';

type Props = {
  classes: Record<string, any>;
};

enum TOP_NAVIGATION {
  'Calendar',
  'Classes',
  'Notes',
  'Chat',
  'Goals',
  'Profile'
}

const Hud = ({ classes }: Props) => {
  const [currentPage, setCurrentPage] = useState<TOP_NAVIGATION>(TOP_NAVIGATION.Profile);

  const navbarItems = [
    {
      id: 'calendar',
      displayName: 'Calendar',
      onSelection: () => setCurrentPage(TOP_NAVIGATION.Calendar)
    },
    {
      id: 'classes',
      displayName: 'Classes',
      onSelection: () => setCurrentPage(TOP_NAVIGATION.Classes)
    },
    {
      id: 'notes',
      displayName: 'Notes',
      onSelection: () => setCurrentPage(TOP_NAVIGATION.Notes)
    },
    {
      id: 'chat',
      displayName: 'Chat',
      onSelection: () => setCurrentPage(TOP_NAVIGATION.Chat)
    },
    {
      id: 'goals',
      displayName: 'Goals',
      onSelection: () => setCurrentPage(TOP_NAVIGATION.Goals)
    },
    {
      id: 'profile',
      displayName: 'Profile',
      onSelection: () => setCurrentPage(TOP_NAVIGATION.Profile)
    }
  ];

  return (
    <main>
      <CssBaseline />
      <div className={cx(classes.app, classes.appWithHud)}>
        <div className={classes.mainAction}>
          {currentPage === TOP_NAVIGATION.Calendar && <CalendarHudItem classes={classes} />}

          {currentPage === TOP_NAVIGATION.Classes && <ClassesHudItem classes={classes} />}

          {currentPage === TOP_NAVIGATION.Notes && <NotesHudItem classes={classes} />}

          {currentPage === TOP_NAVIGATION.Chat && <Chat />}

          {currentPage === TOP_NAVIGATION.Goals && <GoalsHudItem classes={classes} />}

          {currentPage === TOP_NAVIGATION.Profile && <ProfileHudItem classes={classes} />}
        </div>
        <div className={classes.storyAvatar} />
        <div className={classes.miniMap}>
          <MainActionNavbar navbarItems={navbarItems} classes={classes} />
        </div>
        <div className={classes.questTasks} />
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
