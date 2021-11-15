import React from 'react';
import { useSelector } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import cx from 'classnames';
import { useStyles } from './HudFrameStyles';
import StudyToolsArea from '../../hudAreas/studyTools/StudyToolsArea';
import CommunitiesArea from '../../hudAreas/communities/CommunitiesArea';
import ProfileArea from '../../hudAreas/profile/ProfileArea';
import conversations from '../../assets/story/conversations';
import useStorySequence from '../storyState/useStorySequence';
import HudMissions from '../missions/HudMissions';
import HudStoryAvatar from '../story/HudStoryAvatar';
import HudStoryMessage from '../story/HudStoryMessage';
import HudChat from '../chat/HudChat';
import HudExperienceBar from '../experienceBar/HudExperienceBar';
import AchievementsArea from '../../hudAreas/achievements/AchievementsArea';
import HudMainNavigation from '../navigation/HudMainNavigation';
import { HudNavigationState } from '../navigationState/hudNavigationState';
import {
  MORE_MAIN_AREA,
  PROFILE_MAIN_AREA,
  COMMUNITIES_MAIN_AREA,
  STUDY_TOOLS_MAIN_AREA,
  ACHIEVEMENTS_MAIN_AREA
} from '../navigationState/hudNavigation';
import MoreArea from '../../hudAreas/moreArea/MoreArea';

const HudFrame = () => {
  const classes: any = useStyles();

  const selectedMainArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.selectedMainArea
  );

  const selectedMainSubArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.selectedMainSubAreas[selectedMainArea]
  );

  useStorySequence(conversations.crushed);

  return (
    <main>
      <CssBaseline />
      <div className={cx(classes.appWithHud)}>
        <div className={classes.mainAction}>
          {selectedMainArea === PROFILE_MAIN_AREA && <ProfileArea />}

          {selectedMainArea === COMMUNITIES_MAIN_AREA && <CommunitiesArea />}

          {selectedMainArea === STUDY_TOOLS_MAIN_AREA && <StudyToolsArea />}

          {selectedMainArea === ACHIEVEMENTS_MAIN_AREA && <AchievementsArea />}

          {selectedMainArea === MORE_MAIN_AREA && <MoreArea />}
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
          <HudMainNavigation />
        </div>

        <div className={classes.missions}>
          <HudMissions />
        </div>
      </div>
    </main>
  );
};

export default HudFrame;
