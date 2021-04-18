// @flow
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import Dialog from '../../components/Dialog';
import type { State as StoreState } from '../../types/state';
import withRoot from '../../withRoot';
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

const OnboardingPopup = ({  user }) => {
  const classes = useStyles();
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user?.data?.userId) {
      setOpen(localStorage.getItem('SHOW_ONBOARDING_POPUP') !== 'false')
    }
  }, [user])

  const closePopup = () => {
    setOpen(false);
  };

  const onStepAction = () => {
    if (step >= ONBOARDING_STEPS.length - 1) {
      localStorage.setItem('SHOW_ONBOARDING_POPUP', 'false');
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
        onClose={closePopup}
      />
    </Dialog>
  );
};

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect(
  mapStateToProps,
  null,
)(withRoot(OnboardingPopup));