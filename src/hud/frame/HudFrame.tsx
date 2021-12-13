import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Action, Dispatch } from 'redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import cx from 'classnames';
import { Hidden } from '@material-ui/core';
import { useStyles } from './HudFrameStyles';
import StudyToolsArea from '../../hudAreas/studyTools/StudyToolsArea';
import CommunitiesArea from '../../hudAreas/communities/CommunitiesArea';
import ProfileArea from '../../hudAreas/profile/ProfileArea';
import HudMissions from '../missions/HudMissions';
import AchievementsArea from '../../hudAreas/achievements/AchievementsArea';
import { HudNavigationState } from '../navigationState/hudNavigationState';
import {
  CHAT_MAIN_AREA,
  PROFILE_MAIN_AREA,
  COMMUNITIES_MAIN_AREA,
  STUDY_TOOLS_MAIN_AREA,
  ACHIEVEMENTS_MAIN_AREA,
  RIGHT_SIDE_AREA
} from '../navigationState/hudNavigation';
import HudControlPanel from '../controlPanel/HudControlPanel';
import ChatArea from '../../hudAreas/chat/ChatArea';
import { STUDY_TOOLS_QUERY_KEY, STUDY_TOOLS_TOP_OPTION } from '../../routeConstants';
import { setStudyToolsOption } from '../navigationState/hudNavigationActions';
import HudStudyTools from '../missions/HudStudyTools';
import HudTitle from '../title/HudTitle';
import HudExperienceBar from '../experienceBar/HudExperienceBar';
import HudDisplay from '../display/HudDisplay';
import MobileActions from '../mobileActions/MobileActions';
import MobileMenu from '../mobileMenu/MobileMenu';

const HudFrame = () => {
  const classes: any = useStyles();

  const dispatch: Dispatch<Action> = useDispatch();

  const selectedMainArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.selectedMainArea
  );

  const studyToolsOption: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.studyToolsOption
  );

  const isRightPaneVisible: boolean = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.sideAreaToIsVisible[RIGHT_SIDE_AREA]
  );

  const query: string = useSelector((state: any) => state.router.location.query);
  const newStudyToolsOption = query[STUDY_TOOLS_QUERY_KEY];

  if (newStudyToolsOption) {
    dispatch(setStudyToolsOption(newStudyToolsOption));
  }
  return (
    <main>
      <CssBaseline />
      <div className={cx(classes.appWithHud)}>
        <div className={classes.appNavbar}>
          <HudControlPanel />
        </div>
        <div
          className={cx(
            classes.appContent,
            selectedMainArea === CHAT_MAIN_AREA
              ? classes.wideAppContent
              : classes.standardAppContent
          )}
        >
          <div className={classes.mainContainer}>
            <div className={classes.mainHeader}>
              <HudTitle />
            </div>
            <div className={classes.mainAction}>
              {selectedMainArea === PROFILE_MAIN_AREA && <ProfileArea />}

              {selectedMainArea === COMMUNITIES_MAIN_AREA && <CommunitiesArea />}

              {selectedMainArea === STUDY_TOOLS_MAIN_AREA && <StudyToolsArea />}

              {selectedMainArea === ACHIEVEMENTS_MAIN_AREA && <AchievementsArea />}

              {selectedMainArea === CHAT_MAIN_AREA && <ChatArea />}
            </div>
            <div className={classes.mainFooter}>
              <HudDisplay />
            </div>
          </div>

          {isRightPaneVisible && (
            <div className={classes.rightPanel}>
              {(!studyToolsOption || studyToolsOption === STUDY_TOOLS_TOP_OPTION) && (
                <div className={classes.studyTools}>
                  <HudStudyTools />
                </div>
              )}

              <div className={classes.missions}>
                <HudMissions />
              </div>
            </div>
          )}
        </div>

        <Hidden mdUp>
          <MobileMenu />
          <MobileActions />
        </Hidden>
      </div>
    </main>
  );
};

export default HudFrame;
