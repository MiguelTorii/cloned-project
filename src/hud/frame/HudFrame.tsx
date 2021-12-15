import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Action, Dispatch } from 'redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import cx from 'classnames';
import { Box, Hidden, IconButton } from '@material-ui/core';
import IconLeft from '@material-ui/icons/ArrowBack';
import IconRight from '@material-ui/icons/ArrowForward';
import { useStyles } from './HudFrameStyles';
import StudyToolsArea from '../../hudAreas/studyTools/StudyToolsArea';
import CommunitiesArea from '../../hudAreas/communities/CommunitiesArea';
import ProfileArea from '../../hudAreas/profile/ProfileArea';
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
import {
  KEY_IS_FIRST_TIME,
  KEY_IS_FIRST_TIME_OPTION_YES,
  STUDY_TOOLS_QUERY_KEY
} from '../../routeConstants';
import {
  setStudyToolsOption,
  toggleSideAreaVisibility
} from '../navigationState/hudNavigationActions';
import HudTitle from '../title/HudTitle';
import MobileActions from '../mobileActions/MobileActions';
import MobileMenu from '../mobileMenu/MobileMenu';
import OnboardingModal from '../onboardingModal/OnboardingModal';
import HudStory from '../story/HudStory';
import HudExperienceBar from '../experienceBar/HudExperienceBar';
import { HudStoryState } from '../storyState/hudStoryState';
import { openOnboardingPopup } from '../storyState/hudStoryActions';
import HudRightPanel from './HudRightPanel';
import useOnboarding from '../storyState/useOnboarding';

let onboardingPopupTriggered = false;

const HudFrame = () => {
  const classes: any = useStyles();

  const dispatch: Dispatch<Action> = useDispatch();

  useOnboarding();

  const selectedMainArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.selectedMainArea
  );

  const isRightPaneVisible: boolean = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.sideAreaToIsVisible[RIGHT_SIDE_AREA]
  );

  const isShowingOnboardingPopup: boolean = useSelector(
    (state: { hudStory: HudStoryState }) => state.hudStory.isShowingOnboardingPopup
  );

  const query: string = useSelector((state: any) => state.router.location.query);

  const handleToggleRightPane = useCallback(() => {
    dispatch(toggleSideAreaVisibility(RIGHT_SIDE_AREA));
  }, [dispatch]);

  const newStudyToolsOption = query[STUDY_TOOLS_QUERY_KEY];
  if (newStudyToolsOption) {
    dispatch(setStudyToolsOption(newStudyToolsOption));
  }

  const isFirstTime = query[KEY_IS_FIRST_TIME];
  if (!onboardingPopupTriggered && isFirstTime === KEY_IS_FIRST_TIME_OPTION_YES) {
    onboardingPopupTriggered = true;
    dispatch(openOnboardingPopup());
  }

  return (
    <main>
      <CssBaseline />
      <div className={cx(classes.appWithHud)}>
        <div className={classes.appNavbar}>
          <HudControlPanel />
        </div>

        {isShowingOnboardingPopup ? (
          <OnboardingModal />
        ) : (
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
                <HudStory />
                <HudExperienceBar />
              </div>
            </div>

            <Hidden mdDown>
              <Box position="relative" minWidth={isRightPaneVisible ? 'auto' : 20}>
                <IconButton className={classes.rightPaneToggle} onClick={handleToggleRightPane}>
                  {isRightPaneVisible ? <IconRight /> : <IconLeft />}
                </IconButton>
                <HudRightPanel />
              </Box>
            </Hidden>
          </div>
        )}
        <Hidden mdUp>
          <MobileMenu />
          <MobileActions />
        </Hidden>
      </div>
    </main>
  );
};

export default HudFrame;
