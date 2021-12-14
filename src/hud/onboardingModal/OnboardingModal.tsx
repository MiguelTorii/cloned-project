import { Button, Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import GradientButton from '../../components/Basic/Buttons/GradientButton';
import Dialog from '../../components/Dialog/Dialog';
import HudStory from '../story/HudStory';
import { useStyles } from './OnboardingModalStyles';
import useStorySequence from '../storyState/useStorySequence';
import { closeOnboardingPopup } from '../storyState/hudStoryActions';

const onboardingIntroduction = "Hi, I'm Kobe, your study bot.  How about a tour?";

const OnboardingModal = () => {
  const classes: any = useStyles();

  const dispatch = useDispatch();

  const { sayStatement, sayGreeting } = useStorySequence();

  useEffect(() => {
    sayStatement(onboardingIntroduction);
  }, []);

  const startOnboarding = () => {
    dispatch(closeOnboardingPopup(true));
  };

  const skipOnboarding = () => {
    sayGreeting();
    dispatch(closeOnboardingPopup(false));
  };

  return (
    <Dialog
      ariaDescribedBy="onboarding-description"
      disableEscapeKeyDown={false}
      className={classes.dialog}
      open
      showHeader={false}
      title={'Welcome'}
    >
      <div className={classes.content}>
        <div className={classes.welcomeMessageContainer}>
          <HudStory />
        </div>
        <div className={classes.welcomeButtonsContainer}>
          <GradientButton compact onClick={startOnboarding}>
            Start Onboarding
          </GradientButton>
          <Button variant="text" onClick={skipOnboarding}>
            Do it later
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default OnboardingModal;
