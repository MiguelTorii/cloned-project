import React, { useState, useEffect } from 'react';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import expertOnboardingSecond from 'assets/gif/expert-onboarding-step2.gif';
import expertOnboardingFirst from 'assets/svg/expert-onboarding-step1.svg';
import ErrorBoundary from 'containers/ErrorBoundary/ErrorBoundary';

import { styles } from '../_styles/OnboardingExpert';
import Dialog from '../Dialog/Dialog';
import LoadImg from '../LoadImg/LoadImg';

type Props = {
  classes?: Record<string, any>;
  open?: boolean;
  userId?: string;
  updateOnboarding?: (...args: Array<any>) => any;
};

const ImageFirst = () => (
  <div
    style={{
      margin: '0px 32px'
    }}
  >
    <LoadImg
      url={expertOnboardingFirst}
      style={{
        width: '100%'
      }}
    />
  </div>
);

const ImageSecond = () => (
  <div
    style={{
      margin: '0px 32px'
    }}
  >
    <LoadImg
      url={expertOnboardingSecond}
      style={{
        width: '100%'
      }}
    />
  </div>
);

const titleStyle: any = {
  fontSize: 48,
  textAlign: 'center'
};

const bodyStyle = {
  fontSize: 20,
  marginBottom: 20,
  padding: 16,
  fontWeight: 700
};

const FirstTitle = () => (
  <div style={titleStyle}>
    <div>Introducing</div>
    <div
      style={{
        fontStyle: 'italic'
      }}
    >
      <b>Expert Mode</b>
    </div>
  </div>
);

const SecondTitle = () => (
  <div style={titleStyle}>
    <div>Expert Mode has</div>
    <div>
      <b>One-Touch Send.</b>
    </div>
  </div>
);

const FirstBody = () => (
  <div style={bodyStyle}>
    It’s easier to support your students now when you’re in Expert Mode. For example, you can view
    every class at once in the feed.
  </div>
);

const SecondBody = () => (
  <div style={bodyStyle}>
    One-Touch Send is a new feature that allows you to send the same message or post to more than
    one class with one button!
  </div>
);

const STEPS = [
  {
    buttonText: 'Ooh! What else?!',
    demoComponent: ImageFirst,
    body: FirstBody,
    title: FirstTitle
  },
  {
    buttonText: 'Let’s do this! 🚀',
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
}) => (
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
        <div className={activeStep === 0 ? classes.stepEnabled : classes.stepDisabled} />
        <div className={activeStep === 1 ? classes.stepEnabled : classes.stepDisabled} />
      </div>
    </div>
    <div className={classes.demoPanel}>{DemoComponent && <DemoComponent />}</div>
  </div>
);

const Onboarding = ({ classes, open, userId, updateOnboarding }: Props) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleButtonClick = async () => {
    if (activeStep === 0) {
      setActiveStep(activeStep + 1);
    } else {
      updateOnboarding();
    }
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
          classes={classes as any}
          handleButtonClick={handleButtonClick}
          buttonText={currentStep.buttonText}
          DemoComponent={currentStep.demoComponent}
          Body={currentStep.body}
          activeStep={activeStep}
          Title={currentStep.title}
          buttonDisabled={undefined}
        />
      </Dialog>
    </ErrorBoundary>
  );
};

export default withStyles(styles as any)(Onboarding);
