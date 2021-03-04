// @flow
import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

// import { logEventLocally } from 'api/analytics';
import ErrorBoundary from 'containers/ErrorBoundary';
import Dialog, { dialogStyle } from 'components/Dialog';
import LoadImg from 'components/LoadImg'

import expertOnboardingFirst from 'assets/svg/expert-onboarding-step1.svg';
import expertOnboardingSecond from 'assets/gif/expert-onboarding-step2.gif';
import backgroundImg from 'assets/img/onboarding-background.png';

const centered = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
};

const styles = theme => ({
  actionPanel: {
    flex: 2,
    flexDirection: 'column',
    paddingLeft: theme.spacing(),
    paddingRight: theme.spacing(4),
    ...centered,
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
    width: 200,
  },
  demoPanel: {
    borderRadius: 8,
    background: `url(${backgroundImg})`,
    flex: 3,
    ...centered,
  },
  dialog: {
    ...dialogStyle,
    backgroundColor: theme.circleIn.palette.primaryBackground,
    zIndex: 1300,
    height: 700,
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
    bottom: 20,
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
    justifyContent: 'space-between',
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
    <LoadImg url={expertOnboardingFirst} style={{ width: '100%' }} />
  </div>
);

const ImageSecond = () => (
  <div style={{ margin: '0px 32px' }}>
    <LoadImg url={expertOnboardingSecond} style={{ width: '100%' }} />
  </div>
);

const titleStyle = {
  fontSize: 48,
  textAlign: 'center'
}

const bodyStyle = {
  fontSize: 20,
  marginBottom: 20,
  padding: 16,
  fontWeight: 700
}

const FirstTitle = () => (
  <div style={titleStyle}>
    <div>Introducing</div>
    <div style={{ fontStyle: 'italic' }}><b>Expert Mode</b></div>
  </div>
)

const SecondTitle = () => (
  <div style={titleStyle}>
    <div>
      Expert Mode has
    </div>
    <div>
      <b>
      One-Touch Send.
      </b>
    </div>
  </div>
)

const FirstBody = () => (
  <div style={bodyStyle}>
    It’s easier to support your students now when you’re in Expert Mode. For example, you can view every class at once in the feed.
  </div>
)

const SecondBody = () => (
  <div style={bodyStyle}>
    One-Touch Send is a new feature that allows you to send the same message or post to more than one class with one button!
  </div>
)

const STEPS = [
  {
    buttonText: 'Ooh! What else?!',
    demoComponent: ImageFirst,
    body: FirstBody,
    title: FirstTitle,
  },
  {
    buttonText: 'Let’s do this! 🚀',
    demoComponent: ImageSecond,
    body: SecondBody,
    title: SecondTitle,
  },
]

const OnboardingStep = ({ classes, handleButtonClick, activeStep,
  buttonDisabled, buttonText, DemoComponent, Title, Body,
}) => {
  return (
    <div className={classes.step}>
      <div className={classes.actionPanel}>
        <Title />
        <Body />
        <div>
          <Button
            color='primary'
            disabled={buttonDisabled}
            className={classes.button}
            onClick={handleButtonClick}
            variant='contained'
          >
            {buttonText}
          </Button>
        </div>
        <div className={classes.stepsContainer}>
          <div className={activeStep === 0 ? classes.stepEnabled : classes.stepDisabled} />
          <div className={activeStep === 1 ? classes.stepEnabled : classes.stepDisabled} />
        </div>
      </div>
      <div className={classes.demoPanel}>
        {DemoComponent && <DemoComponent />}
      </div>
    </div>
  )
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
    if (activeStep === 0)
      setActiveStep(activeStep + 1);
    else updateOnboarding()
  }

  const currentStep = STEPS[activeStep];

  return (
    <ErrorBoundary>
      <Dialog
        ariaDescribedBy='onboarding-description'
        className={classes.dialog}
        fullWidth
        disableBackdropClick
        maxWidth='lg'
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
}

export default withStyles(styles)(Onboarding);
