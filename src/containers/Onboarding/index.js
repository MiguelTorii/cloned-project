// @flow

// $FlowFixMe
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import MobileStepper from '@material-ui/core/MobileStepper';
import Lottie from 'react-lottie'
import OnboardSelectRewards from 'components/OnboardSelectRewards'
import circles1 from 'assets/svg/background-circle-1.svg'
import circles2 from 'assets/svg/background-circle-2.svg'
import circles3 from 'assets/svg/background-circle-3.svg'
import animation1 from '../../assets/lottie/slide_1_animation.json'
import animation2 from '../../assets/lottie/slide_2_animation.json'
import animation3 from '../../assets/lottie/slide_3_animation.json'
import animation4 from '../../assets/lottie/slide_4_animation.json'
import withRoot from '../../withRoot';
import ErrorBoundary from '../ErrorBoundary';
import { logEvent } from '../../api/analytics';

const styles = theme => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    textAlign: 'center'
  },
  button: {
    marginTop: theme.spacing(2)
  },
  stepper: {
    maxWidth: 400,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginTop: theme.spacing(2)
  },
  img: {
    height: 200,
    maxHeight: 200,
    marginBottom: theme.spacing(2)
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    width: 200,
    justifyContent: 'space-evenly',
  }
});

type Props = {
  classes: Object,
  open: boolean,
  onClose: Function
};

const Onboarding = ({ classes, open, onClose }: Props) => {
  const [activeStep, setActiveStep] = useState(null)
  const [animations] = useState([animation1, animation2, animation3, animation4])
  const [currentAnimation, setCurrentAnimation] = useState(animation1)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    setActiveStep(0)
    if (open) {
      logEvent({ event: 'Onboarding- First Onboarding Opened', props: {} });
    }
  }, [open])

  useLayoutEffect(() => {
    if (activeStep !== null) setCurrentAnimation(animations[activeStep])
  }, [activeStep, animations])

  const handleNext = () => {
    setHovered(false)
    if (activeStep === 3) {
      onClose();
      return;
    }
    if (activeStep === 2) {
      logEvent({ event: 'Onboarding- Last Onboarding Opened', props: {} });
    }

    setActiveStep(activeStep + 1)
  };

  const handleBack = () => {
    if (activeStep !== null) setActiveStep(activeStep - 1)
    setHovered(false)
  }

  const onClick = () => {
    if (activeStep === 2) setHovered(true)
  }

  const renderTitle = step => {
    switch (step) {
    case 1:
      return 'BUILD STRONG STUDY HABITS';
    case 2:
      return 'EARN REWARDS AS YOU BUILD BETTER HABITS';
    case 3:
      return "SEE WHAT YOU CAN DO ON CIRCLEIN";
    default:
      return 'BEING A STUDENT IS DIFFICULT...';
    }
  };

  const renderBody = step => {
    switch (step) {
    case 1:
      return 'of reviewing your notes and the notes your classmates share to get ahead of exams.'
    case 2:
      return 'Don\'t worry. You can change these later.';
    case 3:
      return "Check out how students are sharing notes and much more by viewing example posts in the Study Feed.";
    default:
      return 'Classwork + Exams = OVERWHELMING';
    }
  };

  const renderSubTitle = () => {
    if (activeStep === 2) return 'Pick your top three rewards below to let us know which prices you want to win for being a superb notetaker'
    return ''
  }

  const backgroundStyle = {
    position: 'absolute',
    objectFit: 'scale-down',
    height: 180,
    top: 80
  }

  const renderBackground = () => {
    if (activeStep === 0) return <img style={backgroundStyle} src={circles1} alt='circles' />
    if (activeStep === 1) return <img style={backgroundStyle} src={circles2} alt='circles' />
    if (activeStep === 3) return <img style={backgroundStyle} src={circles3} alt='circles' />
    return null
  }
  
  return (
    <ErrorBoundary>
      <Dialog
        fullWidth
        open={open}
        disableBackdropClick
        disableEscapeKeyDown
        aria-labelledby="onboarding-title"
        aria-describedby="onboarding-description"
      >
        <DialogTitle id="onboarding-title" className={classes.title}>
          {renderTitle(activeStep)}
        </DialogTitle>
        <DialogContent className={classes.content}>
          {renderBackground()}
          <DialogContentText color="textPrimary" align="center">
            {renderSubTitle()}
          </DialogContentText>
          <div onClick={onClick} role='presentation'>
            {!hovered && <Lottie 
              options={{
                loop: true,
                autoplay: true, 
                animationData: currentAnimation,
              }}
              width={200}
              height={200}
              className={classes.img}
            />}
            {activeStep === 2 && hovered && <OnboardSelectRewards/>} 
          </div>
          <DialogContentText color="textPrimary" align="center">
            {renderBody(activeStep)}
          </DialogContentText>
          <div className={classes.buttons}>
            {activeStep !== null && activeStep > 0 && activeStep < 3 && <Button
              color="primary"
              variant="outlined"
              className={classes.button}
              onClick={handleBack}
            >
                Back
            </Button>}
            <Button
              color="primary"
              variant="contained"
              className={classes.button}
              onClick={handleNext}
            >
              {activeStep === 3 ? 'Get Started' : 'Next'}
            </Button>
          </div>
          <MobileStepper
            variant="dots"
            steps={4}
            position="static"
            activeStep={activeStep}
            className={classes.stepper}
          />
        </DialogContent>
      </Dialog>
    </ErrorBoundary>
  );
}

export default withRoot(withStyles(styles)(Onboarding));
