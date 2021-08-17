// @flow
import React, { useState, useEffect, useMemo } from 'react';
import { connect, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { makeStyles } from '@material-ui/core';
import { getCampaign } from 'api/campaign';
import { logEventLocally } from 'api/analytics';
import Dialog from '../../components/Dialog';
import type { State as StoreState } from '../../types/state';
import withRoot from '../../withRoot';
import { confirmTooltip as confirmTooltipAction } from '../../actions/user';
import { ONBOARDING_STEPS, ONBOARDING_STEPS_FOR_CHAT_LANDING } from './steps';
import OnboardingStep from './OnboardingStep';

const useStyles = makeStyles((theme) => ({
  dialog: {
    width: 750,
    height: 625,
    padding: 0,
    [theme.breakpoints.down('sm')]: {
      height: 710
    }
  },
  dialogContent: {
    padding: '0 !important'
  }
}));

const ONBOARDING_POPUP_ID = 9065;

type Props = {
  open: boolean,
  userId: number,
  updateOnboarding: Function
};

const OnboardingPopup = ({ open, userId, updateOnboarding }: Props) => {
  const classes = useStyles();
  const [step, setStep] = useState(0);
  const campaign = useSelector((state) => state.campaign);

  // If landing page is Chat, we put chat page to the last.
  const onboardingSteps = useMemo(() => {
    if (campaign.chatLanding) return ONBOARDING_STEPS_FOR_CHAT_LANDING;
    return ONBOARDING_STEPS;
  }, [campaign.chatLanding]);

  useEffect(() => {
    if (open) {
      logEventLocally({
        category: 'Onboarding',
        objectId: userId,
        type: 'Started'
      });
    }
  }, [open, userId]);

  const closePopup = () => {
    logEventLocally({
      category: 'Onboarding',
      objectId: userId,
      type: 'Ended'
    });
    updateOnboarding({ viewedOnboarding: true });
  };

  const onStepAction = () => {
    if (step >= onboardingSteps.length - 1) {
      closePopup();
    } else {
      setStep(step + 1);
    }
  };
  const onBackAction = () => {
    if (step <= 0) {
      return;
    } else {
      setStep(step - 1);
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
        data={onboardingSteps[step]}
        step={step + 1}
        totalSteps={onboardingSteps.length}
        onAction={onStepAction}
        onBackAction={onBackAction}
        onClose={closePopup}
      />
    </Dialog>
  );
};

export default withRoot(OnboardingPopup);
