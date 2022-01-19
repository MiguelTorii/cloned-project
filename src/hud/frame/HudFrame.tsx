import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Action, Dispatch } from 'redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import cx from 'classnames';
import { Box, Hidden, IconButton, SvgIcon } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import { useTheme } from '@material-ui/core/styles';
import { ReactComponent as CollapseIcon } from 'assets/svg/collapse-icon.svg';
import useIconClasses from 'components/_styles/Icons';
import { useStyles } from './HudFrameStyles';
import StudyToolsArea from '../../hudAreas/studyTools/StudyToolsArea';
import CommunitiesArea from '../../hudAreas/communities/CommunitiesArea';
import ProfileArea from '../../hudAreas/profile/ProfileArea';
import AchievementsArea from '../../hudAreas/achievements/AchievementsArea';
import { HudNavigationState } from '../navigationState/hudNavigationState';
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
import HudControlPanel from '../controlPanel/HudControlPanel';
import ChatArea from '../../hudAreas/chat/ChatArea';
import {
  KEY_IS_FIRST_TIME,
  KEY_IS_FIRST_TIME_OPTION_YES,
  STUDY_TOOLS_QUERY_KEY
} from '../../routeConstants';
import {
  setSideAreaVisibility,
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
import UserDialog from '../../containers/UserDialog/UserDialog';

const HudFrame = () => {
  const classes: any = useStyles();
  const dispatch: Dispatch<Action> = useDispatch();
  const theme = useTheme();
  const isSmallWindow = useMediaQuery(theme.breakpoints.down('sm'));
  const [forceHideSideArea, setForceHideSideArea] = useState(false);
  const iconClasses = useIconClasses();

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

        {isShowingOnboardingPopup ? (
          <OnboardingModal />
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

                  {selectedMainArea === CHAT_MAIN_AREA && <ChatArea />}
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
    </main>
  );
};

export default HudFrame;
