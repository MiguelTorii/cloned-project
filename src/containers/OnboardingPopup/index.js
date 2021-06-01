// @flow
import React, { useState, useEffect, useMemo } from 'react';
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

const STUDY_ROOM_ONBOARDING_POPUP_ID = 9065

const OnboardingPopup = ({ viewedTooltips, confirmTooltip }) => {
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
      viewedTooltips.indexOf(STUDY_ROOM_ONBOARDING_POPUP_ID) === -1
    ) {
      setOpen(true)
    }
  }, [viewedTooltips])

  const visiabled = useMemo(() => {
    return campaign?.variation_key && campaign?.variation_key !== 'hidden'
  }, [campaign])

  const closePopup = () => {
    setOpen(false);
  };

  const onStepAction = () => {
    if (step >= ONBOARDING_STEPS.length - 1) {
      confirmTooltip(STUDY_ROOM_ONBOARDING_POPUP_ID)
      closePopup();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <Dialog
      className={classes.dialog}
      contentClassName={classes.dialogContent}
      open={open && visiabled}
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
)(withRoot(OnboardingPopup));