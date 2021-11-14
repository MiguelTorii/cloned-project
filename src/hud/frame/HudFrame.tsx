import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import cx from 'classnames';
import { useStyles } from './HudFrameStyles';
import StudyToolsArea from '../../hudAreas/studyTools/NotebookArea';
import CommunitiesArea from '../../hudAreas/communities/CommunitiesArea';
import CalendarSubArea from '../../hudAreas/studyTools/CalendarSubArea';
import ProfileArea from '../../hudAreas/profile/ProfileArea';
import Chat from '../../containers/MainChat/MainChat';
import conversations from '../../assets/story/conversations';
import useStorySequence from '../story/useStorySequence';
import { AppState } from '../../configureStore';
import { User } from '../../types/models';
import HudMissions from '../missions/HudMissions';
import HudToolbar from '../navigation/HudToolbar';
import HudStoryAvatar from '../story/HudStoryAvatar';
import HudStoryMessage from '../story/HudStoryMessage';
import HudChat from '../chat/HudChat';
import HudExperienceBar from '../experienceBar/HudExperienceBar';
import AchievementsArea from '../../hudAreas/achievements/AchievementsArea';
import rootNavigation, {
  ACHIEVEMENTS_AREA_ID,
  CHAT_AREA_ID,
  COMMUNITIES_AREA_ID,
  PROFILE_AREA_ID,
  STUDY_TOOLS_AREA_ID,
  WORKFLOW_SUBAREA_ID
} from '../navigation/HudNavigation';

const HudFrame = () => {
  const classes: any = useStyles();

  // TODO move these out to navigation once we have hud redux state.
  const profile = useSelector<AppState, User>((state) => state.user.data);
  const rootNavigationItems = rootNavigation(profile);
  const [selectedArea, setSelectedArea] = useState<string>(rootNavigationItems[0].id);

  useStorySequence(conversations.crushed);

  return (
    <main>
      <CssBaseline />
      <div className={cx(classes.appWithHud)}>
        <div className={classes.mainAction}>
          {selectedArea === PROFILE_AREA_ID && <ProfileArea />}

          {selectedArea === COMMUNITIES_AREA_ID && <CommunitiesArea />}

          {selectedArea === STUDY_TOOLS_AREA_ID && <StudyToolsArea />}

          {selectedArea === ACHIEVEMENTS_AREA_ID && <AchievementsArea />}

          {selectedArea === WORKFLOW_SUBAREA_ID && <CalendarSubArea />}

          {selectedArea === CHAT_AREA_ID && <Chat />}
        </div>

        <div className={classes.chat}>
          <HudChat />
        </div>

        <div className={classes.storyAvatar}>
          <HudStoryAvatar />
        </div>

        <div className={classes.storyMessage}>
          <HudStoryMessage />
        </div>

        <div className={classes.experienceBar}>
          <HudExperienceBar />
        </div>

        <div className={classes.navigation}>
          <HudToolbar onSelectItem={setSelectedArea} navbarItems={rootNavigationItems} />
        </div>

        <div className={classes.missions}>
          <HudMissions />
        </div>
      </div>
    </main>
  );
};

export default HudFrame;
