// @flow

// $FlowFixMe
import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import cx from 'classnames';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MobileStepper from '@material-ui/core/MobileStepper';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Lottie from 'react-lottie';
import animation1 from '../../assets/lottie/page_turning.json';
import animation2 from '../../assets/lottie/coinpig.json';
import giftCards from '../../assets/img/gift-cards.png';
import addClasses from '../../assets/img/add-classes.png';
import withRoot from '../../withRoot';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import Dialog, { dialogStyle } from '../../components/Dialog/Dialog';
import { logEvent, logEventLocally } from '../../api/analytics';
import { updateProfile as updateUserProfile } from '../../api/user';

const styles = (theme) => ({
  content: {
    alignItems: 'center',
    display: 'flex',
    flex: 'initial',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 'initial'
  },
  button: {
    borderRadius: 8,
    borderWidth: 2,
    fontWeight: 'bold',
    margin: '0px 10px',
    padding: '4px 30px'
  },
  buttonLarge: {
    padding: '8px 48px'
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
  img: {
    height: 200,
    maxHeight: 200,
    marginBottom: theme.spacing(2)
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    margin: '20px 0px'
  },
  formControl: {
    margin: 20,
    width: 300
  },
  money: {
    color: '#60b515',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    maxWidth: 600,
    textAlign: 'center'
  },
  dialog: {
    ...dialogStyle,
    padding: 20,
    width: 750
  }
});

type Props = {
  classes: Object,
  open: boolean,
  userId: number,
  updateOnboarding: Function
};

const Onboarding = ({ classes, open, userId, updateOnboarding }: Props) => {
  const [activeStep, setActiveStep] = useState(1);
  const [studyPreference, setStudyPreference] = useState('');
  const [studyMethod, setStudyMethod] = useState('');
  const [studyLength, setStudyLength] = useState('');
  const [other, setOther] = useState('');

  useEffect(() => {
    setActiveStep(1);

    if (open) {
      logEvent({ event: 'Onboarding- First Onboarding Opened', props: {} });
      logEventLocally({
        category: 'Onboarding',
        objectId: userId,
        type: 'Started'
      });
    }
  }, [open, userId]);

  const renderTitle = (step) => {
    switch (step) {
      case 1:
        return 'We’re here to help you pass your classes.';
      case 2:
        return 'We help you study while you earn gifts for helping classmates.';
      case 3:
        return 'Get started by adding your classes on CircleIn.';
      default:
        return '...';
    }
  };

  const renderSubtitle = (step) => {
    switch (step) {
      case 1:
        return 'But first, we need to get to know you better.';
      case 2:
        return 'Earn gifts like real scholarships between';
      case 3:
        return '';
      default:
        return '...';
    }
  };

  const renderBody = (step) => {
    switch (step) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      default:
        return <Step1 />;
    }
  };

  const Step1 = () => (
    <div>
      <div style={{ display: 'flex' }}>
        <FormControl className={classes.formControl}>
          <InputLabel id="select-preference-label">
            How do you prefer to study?
          </InputLabel>
          <Select
            id="select-preference"
            labelId="select-preference-label"
            onChange={(event) => setStudyPreference(event.target.value)}
            value={studyPreference}
          >
            <MenuItem value="By myself">By myself</MenuItem>
            <MenuItem value="In a group of 2-5">In a group of 2-5</MenuItem>
            <MenuItem value="in a group of 6-10">in a group of 6-10</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel id="select-test-label">
            How do you study for tests?
          </InputLabel>
          <Select
            id="select-test"
            labelId="select-test-label"
            onChange={(event) => {
              setStudyMethod(event.target.value);
              setOther('');
            }}
            value={studyMethod}
          >
            <MenuItem value="Read and highlight">Read and highlight</MenuItem>
            <MenuItem value="Read and take notes">Read and take notes</MenuItem>
            <MenuItem value="Read and make flash cards">
              Read and make flash cards
            </MenuItem>
            <MenuItem value="None">None</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div style={{ display: 'flex' }}>
        <FormControl className={classes.formControl}>
          <InputLabel id="select-frequency-label">
            How often do you study each week?
          </InputLabel>
          <Select
            id="select-frequency"
            labelId="select-frequency-label"
            onChange={(event) => setStudyLength(event.target.value)}
            value={studyLength}
          >
            <MenuItem value="1-2 time">1-2 times</MenuItem>
            <MenuItem value="3-5 time">3-5 times</MenuItem>
            <MenuItem value="Everyday">Everyday</MenuItem>
          </Select>
        </FormControl>
        {studyMethod === 'None' && (
          <FormControl className={classes.formControl}>
            <TextField
              autoFocus
              id="text-other"
              label="Tell us how you study..."
              onChange={(event) => setOther(event.target.value)}
              value={other}
            />
          </FormControl>
        )}
      </div>
      <div className={classes.buttons}>
        <Button
          color="primary"
          disabled={
            !studyPreference ||
            !studyMethod ||
            !studyLength ||
            (studyMethod === 'None' && other === '')
          }
          className={classes.button}
          onClick={() => setActiveStep(2)}
          variant="contained"
        >
          Next
        </Button>
      </div>
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: animation1
        }}
        width={250}
        height={250}
        className={classes.img}
      />
    </div>
  );

  const Step2 = () => (
    <div>
      <Typography className={classes.money} component="div" variant="h4">
        $500 - $2500
      </Typography>
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: animation2
        }}
        width={200}
        height={200}
        className={classes.img}
      />
      <Typography component="div" className={classes.subtitle}>
        And <b>gift cards</b> to your favorite places and services with over 30
        options!
      </Typography>
      <div style={{ textAlign: 'center', margin: '16px 0px' }}>
        <img src={giftCards} alt="Gift cards" />
      </div>
      <div className={classes.buttons}>
        <Button
          className={classes.button}
          color="primary"
          onClick={() => setActiveStep(1)}
          variant="outlined"
        >
          Back
        </Button>
        <Button
          className={classes.button}
          color="primary"
          onClick={() => {
            setActiveStep(3);
            logEvent({
              event: 'Onboarding- Last Onboarding Opened',
              props: {}
            });
          }}
          variant="contained"
        >
          Next
        </Button>
      </div>
    </div>
  );

  const Step3 = () => (
    <div>
      <div style={{ textAlign: 'center', margin: '16px 0px' }}>
        <img src={addClasses} alt="Add classes" />
      </div>
      <Typography component="div" className={classes.subtitle}>
        You’ll also receive an email from one of our CircleIn Studying
        Specialists soon. Happy studying!
      </Typography>
      <div className={classes.buttons}>
        <Button
          className={cx(classes.button, classes.buttonLarge)}
          color="primary"
          onClick={async () => {
            await updateUserProfile({
              userId,
              fields: [
                { field: 'study_preference', updated_value: studyPreference },
                {
                  field: 'study_method',
                  updated_value: studyMethod === 'None' ? other : studyMethod
                },
                { field: 'study_length', updated_value: studyLength }
              ]
            });
            logEventLocally({
              category: 'Onboarding',
              objectId: userId,
              type: 'Ended'
            });
            updateOnboarding({ viewedOnboarding: true });
          }}
          variant="contained"
        >
          Get Started
        </Button>
      </div>
    </div>
  );

  return (
    <ErrorBoundary>
      <Dialog
        ariaDescribedBy="onboarding-description"
        className={classes.dialog}
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        showHeader={false}
        title={renderTitle(activeStep)}
      >
        <div className={classes.content}>
          <Typography id="onboarding-description" className={classes.subtitle}>
            {renderSubtitle(activeStep)}
          </Typography>
          {renderBody(activeStep)}
          <MobileStepper
            activeStep={activeStep - 1}
            className={classes.stepper}
            position="static"
            steps={3}
            variant="dots"
          />
        </div>
      </Dialog>
    </ErrorBoundary>
  );
};

export default withRoot(withStyles(styles)(Onboarding));
