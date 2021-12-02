import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import cx from 'classnames';
import { useStyles } from './HudFrameStyles';
import StudyToolsArea from '../../hudAreas/studyTools/StudyToolsArea';
import CommunitiesArea from '../../hudAreas/communities/CommunitiesArea';
import ProfileArea from '../../hudAreas/profile/ProfileArea';
import useStorySequence from '../storyState/useStorySequence';
import HudMissions from '../missions/HudMissions';
import AchievementsArea from '../../hudAreas/achievements/AchievementsArea';
import { HudNavigationState } from '../navigationState/hudNavigationState';
import {
  MORE_MAIN_AREA,
  CHAT_MAIN_AREA,
  PROFILE_MAIN_AREA,
  COMMUNITIES_MAIN_AREA,
  STUDY_TOOLS_MAIN_AREA,
  ACHIEVEMENTS_MAIN_AREA,
  RIGHT_SIDE_AREA,
  LEFT_SIDE_AREA
} from '../navigationState/hudNavigation';
import MoreArea from '../../hudAreas/moreArea/MoreArea';
import HudControlPanel from '../controlPanel/HudControlPanel';
import HudDisplay from '../display/HudDisplay';
import ChatArea from '../../hudAreas/chat/ChatArea';

const HudFrame = () => {
  const classes: any = useStyles();

  const selectedMainArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.selectedMainArea
  );

  const isLeftPaneVisible: boolean = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.sideAreaToIsVisible[LEFT_SIDE_AREA]
  );

  const isRightPaneVisible: boolean = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.sideAreaToIsVisible[RIGHT_SIDE_AREA]
  );

  const loadStory = useStorySequence();
  loadStory();

  return (
    <main>
      <CssBaseline />
      <div className={cx(classes.appWithHud)}>
        <div className={classes.appNavbar}>
          <HudControlPanel />
        </div>
        <div className={classes.appContent}>
          <div className={classes.mainContainer}>
            <div className={classes.mainAction}>
              {selectedMainArea === PROFILE_MAIN_AREA && <ProfileArea />}

              {selectedMainArea === COMMUNITIES_MAIN_AREA && <CommunitiesArea />}

              {selectedMainArea === STUDY_TOOLS_MAIN_AREA && <StudyToolsArea />}

              {selectedMainArea === ACHIEVEMENTS_MAIN_AREA && <AchievementsArea />}

              {selectedMainArea === MORE_MAIN_AREA && <MoreArea />}

              {selectedMainArea === CHAT_MAIN_AREA && <ChatArea />}
            </div>
            <div className={classes.mainHudDisplay}>
              <HudDisplay />
            </div>
          </div>

          {isRightPaneVisible && (
            <div className={classes.missions}>
              <HudMissions />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default HudFrame;
