import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Button, Typography } from '@material-ui/core';

import GradientButton from 'components/Basic/Buttons/GradientButton';
import Dialog from 'components/Dialog/Dialog';

import HudStory from '../story/HudStory';
import { closeOnboardingPopup } from '../storyState/hudStoryActions';
import { introToOnboarding, onboardingCompleted } from '../storyState/onboardingStorySections';
import useStorySequence from '../storyState/useStorySequence';

import { useStyles } from './OnboardingModalStyles';

import type { HudStoryState } from '../storyState/hudStoryState';

const OnboardingModal = () => {
  const classes: any = useStyles();

  const dispatch = useDispatch();

  const { startNextStory, sayGreeting } = useStorySequence();

  const isCurrentSessionOnboardingComplete: boolean = useSelector(
    (state: { hudStory: HudStoryState }) => state.hudStory.isCurrentSessionOnboardingComplete
  );

  useEffect(() => {
    if (isCurrentSessionOnboardingComplete) {
      startNextStory(onboardingCompleted);
    } else {
      startNextStory(introToOnboarding);
    }
  }, []);

  const startOnboarding = () => {
    dispatch(closeOnboardingPopup(true));
  };

  const skipOrFinishOnboarding = () => {
    sayGreeting();
    dispatch(closeOnboardingPopup(false));
  };

  const dialogTitle = isCurrentSessionOnboardingComplete ? '' : 'Welcome!';

  return (
    <Dialog
      ariaDescribedBy="onboarding-description"
      disableEscapeKeyDown={false}
      className={classes.dialog}
      open
      showHeader={false}
      title={dialogTitle}
    >
      <div className={classes.content}>
        <div className={classes.welcomeMessageContainer}>
          <HudStory />
        </div>
        <div className={classes.welcomeButtonsContainer}>
          {isCurrentSessionOnboardingComplete ? (
            <GradientButton compact onClick={skipOrFinishOnboarding}>
              Finish Tour
            </GradientButton>
          ) : (
            <>
              <GradientButton compact onClick={startOnboarding}>
                {"Let's go!"}
              </GradientButton>
              <Button variant="text" onClick={skipOrFinishOnboarding}>
                Next time
              </Button>
            </>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default OnboardingModal;
