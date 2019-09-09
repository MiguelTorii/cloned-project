// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import MobileStepper from '@material-ui/core/MobileStepper';
import withRoot from '../../withRoot';
import ErrorBoundary from '../ErrorBoundary';
import slide1 from '../../assets/img/slide 1.png';
import slide2 from '../../assets/img/slide 2.png';
import slide3 from '../../assets/img/slide 3.png';
import slide4 from '../../assets/img/slide 4.png';
import slide5 from '../../assets/img/slide 5.png';

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
    marginTop: theme.spacing.unit * 2
  },
  stepper: {
    maxWidth: 400,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginTop: theme.spacing.unit * 2
  },
  img: {
    height: 200,
    maxHeight: 200,
    marginBottom: theme.spacing.unit * 2
  }
});

type Props = {
  classes: Object,
  open: boolean,
  onClose: Function
};

type State = {
  activeStep: number
};

class Onboarding extends React.PureComponent<Props, State> {
  state = {
    activeStep: 0
  };

  componentDidMount = () => {};

  handleNext = () => {
    const { activeStep } = this.state;
    const { onClose } = this.props;

    if (activeStep === 4) {
      onClose();
      return;
    }
    this.setState(state => ({
      activeStep: state.activeStep + 1
    }));
  };

  renderTitle = step => {
    switch (step) {
      case 1:
        return 'STUDY WITH CLASSMATES';
      case 2:
        return 'EARN REWARDS';
      case 3:
        return "DON'T WORRY";
      case 4:
        return 'SO, WHAT HAPPENS NEXT?';
      default:
        return 'BEING A STUDENT IS DIFFICULT...';
    }
  };

  renderBody = step => {
    switch (step) {
      case 1:
        return 'Before CircleIn, finding homework & study help was hard. We make it easy to share notes with classmates, get your questions answered, and send helpful tips.';
      case 2:
        return 'We made studying with classmates better, and we also made it so that you earn points towards rewards as you do.';
      case 3:
        return "Now, you don't have to walk up to students to get their phone numbers. We match you with your classmates on CircleIn so you can work better together.";
      case 4:
        return 'We are going to put you into Study mode. Tap on the example posts so you can see how students use CircleIn with their classmates to get help and study.';
      default:
        return 'Balancing classworks, mid terms, and finals all by yourself can feel lonely and overwhelming.';
    }
  };

  renderImg = step => {
    const { classes } = this.props;
    switch (step) {
      case 1:
        return <img src={slide2} alt="Slide 2" className={classes.img} />;
      case 2:
        return <img src={slide3} alt="Slide 3" className={classes.img} />;
      case 3:
        return <img src={slide4} alt="Slide 4" className={classes.img} />;
      case 4:
        return <img src={slide5} alt="Slide 5" className={classes.img} />;
      default:
        return <img src={slide1} alt="Slide 1" className={classes.img} />;
    }
  };

  render() {
    const { classes, open } = this.props;
    const { activeStep } = this.state;

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
            {this.renderTitle(activeStep)}
          </DialogTitle>
          <DialogContent className={classes.content}>
            {this.renderImg(activeStep)}
            <DialogContentText color="textPrimary" align="center">
              {this.renderBody(activeStep)}
            </DialogContentText>
            <Button
              color="primary"
              variant="contained"
              className={classes.button}
              onClick={this.handleNext}
            >
              {activeStep === 4 ? 'Get Started' : 'Next'}
            </Button>
            <MobileStepper
              variant="dots"
              steps={5}
              position="static"
              activeStep={activeStep}
              className={classes.stepper}
            />
          </DialogContent>
        </Dialog>
      </ErrorBoundary>
    );
  }
}

export default withRoot(withStyles(styles)(Onboarding));
