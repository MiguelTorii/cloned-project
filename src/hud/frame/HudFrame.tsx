import React from 'react';
import { useSelector } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import cx from 'classnames';
import { useStyles } from './HudFrameStyles';
import StudyToolsArea from '../../hudAreas/studyTools/StudyToolsArea';
import CommunitiesArea from '../../hudAreas/communities/CommunitiesArea';
import ProfileArea from '../../hudAreas/profile/ProfileArea';
import conversations from '../storyState/conversations';
import useStorySequence from '../storyState/useStorySequence';
import HudMissions from '../missions/HudMissions';
import HudChat from '../chat/HudChat';
import AchievementsArea from '../../hudAreas/achievements/AchievementsArea';
import { HudNavigationState } from '../navigationState/hudNavigationState';
import {
  MORE_MAIN_AREA,
  PROFILE_MAIN_AREA,
  COMMUNITIES_MAIN_AREA,
  STUDY_TOOLS_MAIN_AREA,
  ACHIEVEMENTS_MAIN_AREA,
  TOP_RIGHT_SIDE_AREA,
  BOTTOM_RIGHT_SIDE_AREA,
  TOP_LEFT_SIDE_AREA,
  BOTTOM_LEFT_SIDE_AREA
} from '../navigationState/hudNavigation';
import MoreArea from '../../hudAreas/moreArea/MoreArea';
import HudControlPanel from '../controlPanel/HudControlPanel';

const HudFrame = () => {
  const classes: any = useStyles();

  const selectedMainArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.selectedMainArea
  );

  const isTopLeftPaneVisible: boolean = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.sideAreaToIsVisible[TOP_LEFT_SIDE_AREA]
  );

  const isBottomLeftPaneVisible: boolean = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.sideAreaToIsVisible[BOTTOM_LEFT_SIDE_AREA]
  );

  const isTopRightPaneVisible: boolean = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.sideAreaToIsVisible[TOP_RIGHT_SIDE_AREA]
  );

  const isBottomRightPaneVisible: boolean = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.sideAreaToIsVisible[BOTTOM_RIGHT_SIDE_AREA]
  );

  useStorySequence(conversations.crushed);

  return (
    <main>
      <CssBaseline />
      <div className={cx(classes.appWithHud)}>
        {(isTopLeftPaneVisible || isBottomLeftPaneVisible) && (
          <div className={classes.chat}>
            <HudChat />
          </div>
        )}

        <div className={classes.mainContainer}>
          <div className={classes.mainAction}>
            {selectedMainArea === PROFILE_MAIN_AREA && <ProfileArea />}

            {selectedMainArea === COMMUNITIES_MAIN_AREA && <CommunitiesArea />}

            {selectedMainArea === STUDY_TOOLS_MAIN_AREA && <StudyToolsArea />}

            {selectedMainArea === ACHIEVEMENTS_MAIN_AREA && <AchievementsArea />}

            {selectedMainArea === MORE_MAIN_AREA && <MoreArea />}
          </div>

          <div className={classes.mainControlPanel}>
            <HudControlPanel />
          </div>
        </div>

        {(isTopRightPaneVisible || isBottomRightPaneVisible) && (
          <div className={classes.missions}>
            <HudMissions />
          </div>
        )}
      </div>
    </main>
  );
};

export default HudFrame;
