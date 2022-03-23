import React, { useCallback, useEffect, useState } from 'react';

import cx from 'classnames';
import { useSelector, useDispatch } from 'react-redux';

import { Box, Hidden, IconButton, SvgIcon } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';

import { ReactComponent as CollapseIcon } from 'assets/svg/collapse-icon.svg';
import ChatPage from 'containers/CommunityChat/ChatPage';
import UserDialog from 'containers/UserDialog/UserDialog';
import WebNotification from 'containers/WebNotifications';
import { useNotifier } from 'hooks';
import AchievementsArea from 'hudAreas/achievements/AchievementsArea';
import CommunitiesArea from 'hudAreas/communities/CommunitiesArea';
import ProfileArea from 'hudAreas/profile/ProfileArea';
import StudyToolsArea from 'hudAreas/studyTools/StudyToolsArea';
import {
  KEY_IS_FIRST_TIME,
  KEY_IS_FIRST_TIME_OPTION_YES,
  STUDY_TOOLS_QUERY_KEY
} from 'routeConstants';

import HudControlPanel from '../controlPanel/HudControlPanel';
import HudExperienceBar from '../experienceBar/HudExperienceBar';
import MobileActions from '../mobileActions/MobileActions';
import MobileMenu from '../mobileMenu/MobileMenu';
import {
  CALENDAR_AREA,
  CHAT_MAIN_AREA,
  PROFILE_MAIN_AREA,
  COMMUNITIES_MAIN_AREA,
  STUDY_TOOLS_MAIN_AREA,
  ACHIEVEMENTS_MAIN_AREA,
  RIGHT_SIDE_AREA,
  CHAT_AREA
} from '../navigationState/hudNavigation';
import {
  setSideAreaVisibility,
  setStudyToolsOption,
  toggleSideAreaVisibility
} from '../navigationState/hudNavigationActions';
import OnboardingModal from '../onboardingModal/OnboardingModal';
import HudStory from '../story/HudStory';
import { openOnboardingPopup } from '../storyState/hudStoryActions';
import useOnboarding from '../storyState/useOnboarding';
import HudTitle from '../title/HudTitle';

import { useStyles } from './HudFrameStyles';
import HudRightPanel from './HudRightPanel';

import useIconClasses from 'components/_styles/Icons';

import type { HudNavigationState } from '../navigationState/hudNavigationState';
import type { HudStoryState } from '../storyState/hudStoryState';
import type { Action, Dispatch } from 'redux';

let onboardingPopupTriggered = false;

const HudFrame = () => {
  const classes: any = useStyles();
  const dispatch: Dispatch<Action> = useDispatch();
  const theme = useTheme();
  const isSmallWindow = useMediaQuery(theme.breakpoints.down('sm'));
  const [forceHideSideArea, setForceHideSideArea] = useState(false);
  const iconClasses = useIconClasses();

  useNotifier();
  useOnboarding();

  const selectedMainArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.selectedMainArea
  );

  const selectedMainSubArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.selectedMainSubAreas[selectedMainArea]
  );

  const isRightPaneVisible: boolean = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.sideAreaToIsVisible[RIGHT_SIDE_AREA]
  );

  const handleToggleRightPane = useCallback(() => {
    if (forceHideSideArea) {
      dispatch(setSideAreaVisibility(RIGHT_SIDE_AREA, true));
    } else {
      dispatch(toggleSideAreaVisibility(RIGHT_SIDE_AREA));
    }
    setForceHideSideArea(false);
  }, [dispatch, forceHideSideArea]);

  useEffect(() => {
    setForceHideSideArea(isSmallWindow);
  }, [isSmallWindow]);

  const isShowingOnboardingPopup: boolean = useSelector(
    (state: { hudStory: HudStoryState }) => state.hudStory.isShowingOnboardingPopup
  );

  const viewedOnboarding = useSelector((state) => (state as any).user.syncData.viewedOnboarding);

  const query: string = useSelector((state: any) => state.router.location.query);

  const newStudyToolsOption = query[STUDY_TOOLS_QUERY_KEY];
  if (newStudyToolsOption) {
    dispatch(setStudyToolsOption(newStudyToolsOption));
  }

  const isFirstTime =
    query[KEY_IS_FIRST_TIME] === KEY_IS_FIRST_TIME_OPTION_YES || viewedOnboarding === false;
  if (!onboardingPopupTriggered && isFirstTime) {
    onboardingPopupTriggered = true;
    dispatch(openOnboardingPopup());
  }

  const showRightPanel = !forceHideSideArea && isRightPaneVisible;

  return (
    <main>
      <CssBaseline />
      <UserDialog />
      <div className={cx(classes.appWithHud)}>
        <div className={classes.appNavbar}>
          <HudControlPanel />
        </div>

        {isShowingOnboardingPopup && <OnboardingModal />}

        {isShowingOnboardingPopup ? (
          <div className={cx(classes.appContent, classes.standardAppContent)} />
        ) : (
          <div
            className={cx(
              classes.appContent,
              selectedMainSubArea === CHAT_AREA || selectedMainSubArea === CALENDAR_AREA
                ? classes.wideAppContent
                : classes.standardAppContent
            )}
          >
            {(!isSmallWindow || !showRightPanel) && (
              <div className={classes.mainContainer}>
                <div className={classes.mainHeader}>
                  <HudTitle />
                </div>
                <div className={classes.mainAction}>
                  {selectedMainArea === PROFILE_MAIN_AREA && <ProfileArea />}

                  {selectedMainArea === COMMUNITIES_MAIN_AREA && <CommunitiesArea />}

                  {selectedMainArea === STUDY_TOOLS_MAIN_AREA && <StudyToolsArea />}

                  {selectedMainArea === ACHIEVEMENTS_MAIN_AREA && <AchievementsArea />}

                  {selectedMainArea === CHAT_MAIN_AREA && <ChatPage />}
                </div>
                <div className={classes.mainFooter}>
                  <HudStory />
                  <HudExperienceBar />
                </div>
              </div>
            )}

            <Box position="relative" minWidth={showRightPanel ? 'auto' : 20}>
              {/* TODO Refactor to single reusable expand button */}
              <IconButton className={classes.rightPaneToggle} onClick={handleToggleRightPane}>
                {showRightPanel ? (
                  <SvgIcon
                    className={iconClasses.collapseIcon}
                    component={CollapseIcon}
                    viewBox="0 0 32 32"
                  />
                ) : (
                  <MenuOpenIcon />
                )}
              </IconButton>
              {showRightPanel && <HudRightPanel />}
            </Box>
          </div>
        )}
        <Hidden mdUp>
          <MobileMenu />
          <MobileActions />
        </Hidden>
      </div>
      <WebNotification />
    </main>
  );
};

export default HudFrame;
