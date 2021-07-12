// @flow
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { makeStyles } from '@material-ui/core';
import { getCampaign } from 'api/campaign';
import Dialog from '../../components/Dialog';
import type { State as StoreState } from '../../types/state';
import withRoot from '../../withRoot';
import { confirmTooltip as confirmTooltipAction } from '../../actions/user'
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

const FLASHCARDS_ONBOARDING_ID = 9066

const OnboardingFlashcards = ({ viewedTooltips, confirmTooltip }) => {
  const classes = useStyles();
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    const init = async () => {
      const aCampaign = await getCampaign({ campaignId: 9 });
      setCampaign(aCampaign);
    }

    init()
  }, [])

  useEffect(() => {
    if (
      !!viewedTooltips?.length &&
      viewedTooltips.indexOf(FLASHCARDS_ONBOARDING_ID) === -1
    ) {
      setOpen(true)
    }
  }, [viewedTooltips])

  const closePopup = () => {
    confirmTooltip(FLASHCARDS_ONBOARDING_ID)
    setOpen(false);
  };

  const onStepAction = () => {
    if (step >= ONBOARDING_STEPS.length - 1) {
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
        data={ONBOARDING_STEPS[step]}
        step={step + 1}
        totalSteps={ONBOARDING_STEPS.length}
        onAction={onStepAction}
        onBackAction={onBackAction}
        onClose={closePopup}
      />
    </Dialog>
  );
};

const mapStateToProps = ({ user }: StoreState): {} => ({
  viewedTooltips: user.syncData.viewedTooltips
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      confirmTooltip: confirmTooltipAction
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRoot(OnboardingFlashcards));