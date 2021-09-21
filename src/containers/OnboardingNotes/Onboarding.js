// @flow
import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

// import { logEventLocally } from 'api/analytics';
import ErrorBoundary from 'containers/ErrorBoundary/ErrorBoundary';
import Dialog, { dialogStyle } from 'components/Dialog/Dialog';
import LoadImg from 'components/LoadImg/LoadImg';

import notesOnboardingFirst from 'assets/svg/notesOnboardingFirst.svg';
import notesOnboardingSecond from 'assets/svg/notesOnboardingSecond.svg';
import backgroundImg from 'assets/img/onboarding-background.png';

const centered = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center'
};

const styles = (theme) => ({
  actionPanel: {
    flex: 2,
    flexDirection: 'column',
    paddingLeft: theme.spacing(),
    paddingRight: theme.spacing(4),
    ...centered
  },
  button: {
    backgroundColor: theme.circleIn.palette.darkActionBlue,
    borderRadius: 8,
    color: theme.circleIn.palette.primaryText1,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    margin: theme.spacing(2, 0),
    padding: theme.spacing(1 / 2, 2),
    width: 200
  },
  demoPanel: {
    borderRadius: 8,
    background: `url(${backgroundImg})`,
    flex: 3,
    ...centered
  },
  dialog: {
    ...dialogStyle,
    backgroundColor: theme.circleIn.palette.primaryBackground,
    zIndex: 1300,
    height: 700
  },
  step: {
    display: 'flex',
    height: '100%',
    // eslint-disable-next-line
    height: '-webkit-fill-available'
  },
  stepper: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flexGrow: 1,
    justifyContent: 'center',
    maxWidth: 400,
    position: 'absolute',
    bottom: 20
  },
  stepDisabled: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: theme.circleIn.palette.disabled
  },
  stepEnabled: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: '#c7d3da'
  },
  stepsContainer: {
    width: theme.spacing(3),
    display: 'flex',
    justifyContent: 'space-between'
  }
});

type Props = {
  classes: Object,
  open: boolean,
  userId: number,
  updateOnboarding: Function
};

const ImageFirst = () => (
  <div style={{ margin: '0px 32px' }}>
    <LoadImg url={notesOnboardingFirst} style={{ width: '100%' }} />
  </div>
);

const ImageSecond = () => (
  <div style={{ margin: '0px 32px' }}>
    <LoadImg url={notesOnboardingSecond} style={{ width: '100%' }} />
  </div>
);

const titleStyle = {
  fontSize: 48,
  textAlign: 'center'
};

const bodyStyle = {
  fontSize: 20,
  marginBottom: 20,
  padding: 16,
  textAlign: 'center',
  fontWeight: 'bold'
};

const FirstTitle = () => (
  <div style={titleStyle}>
    <div>Introducing</div>
    <div style={{ fontStyle: 'italic' }}>
      <b>In-App Notetaking</b>
    </div>
  </div>
);

const SecondTitle = () => (
  <div style={titleStyle}>
    <div>Organization and</div>
    <div>Convenience in One Tool.</div>
  </div>
);

const FirstBody = () => (
  <div style={bodyStyle}>
    Now, you can work on CircleIn and take notes all at the same time.
  </div>
);

const SecondBody = () => (
  <div style={bodyStyle}>
    The notes you write on CircleIn are visible to you only, so you can work in
    peace.
  </div>
);

const STEPS = [
  {
    buttonText: 'Next',
    demoComponent: ImageFirst,
    body: FirstBody,
    title: FirstTitle
  },
  {
    buttonText: 'Cool!',
    demoComponent: ImageSecond,
    body: SecondBody,
    title: SecondTitle
  }
];

const OnboardingStep = ({
  classes,
  handleButtonClick,
  activeStep,
  buttonDisabled,
  buttonText,
  DemoComponent,
  Title,
  Body
}) => {
  return (
    <div className={classes.step}>
      <div className={classes.actionPanel}>
        <Title />
        <Body />
        <div>
          <Button
            color="primary"
            disabled={buttonDisabled}
            className={classes.button}
            onClick={handleButtonClick}
            variant="contained"
          >
            {buttonText}
          </Button>
        </div>
        <div className={classes.stepsContainer}>
          <div
            className={
              activeStep === 0 ? classes.stepEnabled : classes.stepDisabled
            }
          />
          <div
            className={
              activeStep === 1 ? classes.stepEnabled : classes.stepDisabled
            }
          />
        </div>
      </div>
      <div className={classes.demoPanel}>
        {DemoComponent && <DemoComponent />}
      </div>
    </div>
  );
};

const Onboarding = ({ classes, open, userId, updateOnboarding }: Props) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (open) {
      // logEventLocally({
      // category: 'Onboarding',
      // objectId: userId,
      // type: 'Started',
      // });
    }
  }, [open, userId]);

  const handleButtonClick = async () => {
    if (activeStep === 0) setActiveStep(activeStep + 1);
    else updateOnboarding();
  };

  const currentStep = STEPS[activeStep];

  return (
    <ErrorBoundary>
      <Dialog
        ariaDescribedBy="onboarding-description"
        className={classes.dialog}
        fullWidth
        maxWidth="lg"
        disableEscapeKeyDown
        open={open}
        showHeader={false}
      >
        <OnboardingStep
          classes={classes}
          handleButtonClick={handleButtonClick}
          buttonText={currentStep.buttonText}
          DemoComponent={currentStep.demoComponent}
          Body={currentStep.body}
          activeStep={activeStep}
          Title={currentStep.title}
        />
      </Dialog>
    </ErrorBoundary>
  );
};

export default withStyles(styles)(Onboarding);
