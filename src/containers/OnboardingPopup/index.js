import React, { useState } from 'react';
import Dialog from '../../components/Dialog';
import withRoot from '../../withRoot';
import { makeStyles } from '@material-ui/core';
import { ONBOARDING_STEPS } from './steps';
import OnboardingStep from './OnboardingStep';

const useStyles = makeStyles(theme => ({
  dialog: {
    width: 750,
    height: 625,
    padding: 0,
    [theme.breakpoints.down('sm')]: {
      height: 710,
    }
  },
  dialogContent: {
    padding: '0 !important'
  }
}));

const OnboardingPopup = () => {
  const classes = useStyles();
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(localStorage.getItem('SHOW_ONBOARDING_POPUP') !== 'false');

  const closePopup = () => {
    localStorage.setItem('SHOW_ONBOARDING_POPUP', 'false');
    setOpen(false);
  };

  const onStepAction = () => {
    if (step >= ONBOARDING_STEPS.length - 1) {
      closePopup();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <Dialog
      className={classes.dialog}
      contentClassName={classes.dialogContent}
      open={open}
      showHeader={false}
      onCancel={closePopup}
    >
      <OnboardingStep
        data={ONBOARDING_STEPS[step]}
        step={step + 1}
        totalSteps={ONBOARDING_STEPS.length}
        onAction={onStepAction}
      />
    </Dialog>
  );
};

export default withRoot(OnboardingPopup);
