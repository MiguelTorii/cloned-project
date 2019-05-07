// @flow

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ValidatorForm } from 'react-material-ui-form-validator';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';
import green from '@material-ui/core/colors/green';
import withStyles from '@material-ui/core/styles/withStyles';
import logo from '../../assets/svg/circlein_logo_beta.svg';

const MyLink = ({ link, ...props }) => <RouterLink to={link} {...props} />;

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  actions: {
    display: 'flex'
  },
  button: {
    margin: theme.spacing.unit
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative'
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  },
  links: {
    width: '100%',
    marginTop: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  }
});

type Props = {
  classes: Object,
  loading: boolean,
  handleSubmit: Function
};

type State = {
  activeStep: number
};

class SignUpForm extends React.PureComponent<Props, State> {
  state = {
    activeStep: 0
  };

  handleBack = () => {
    this.setState(({ activeStep }) => ({
      activeStep: activeStep === 0 ? 0 : activeStep - 1
    }));
  };

  handleNext = () => {
    this.setState(({ activeStep }) => ({ activeStep: activeStep + 1 }));
  };

  render() {
    const { classes, loading, handleSubmit } = this.props;
    const { activeStep } = this.state;
    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <img src={logo} alt="Logo" className={classes.logo} />
          <Typography component="h1" variant="h5">
            Create your CircleIn Account
          </Typography>
          <ValidatorForm onSubmit={handleSubmit} className={classes.form}>
            <Stepper activeStep={activeStep} alternativeLabel>
              <Step>
                <StepLabel>Account Setup</StepLabel>
              </Step>
              <Step>
                <StepLabel>Verification</StepLabel>
              </Step>
              <Step>
                <StepLabel>Profile Setup</StepLabel>
              </Step>
            </Stepper>
            <div className={classes.actions}>
              <Button
                fullWidth
                variant="outlined"
                color="default"
                disabled={activeStep === 0 || loading}
                onClick={this.handleBack}
                className={classes.button}
              >
                Back
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={this.handleNext}
                disabled={loading}
                className={classes.button}
              >
                Next
              </Button>
            </div>
            <div className={classes.wrapper}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={activeStep < 2 || loading}
                className={classes.submit}
              >
                Submit
              </Button>
              {loading && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </div>
          </ValidatorForm>
          <div className={classes.links}>
            <Typography variant="subtitle1" gutterBottom>
              {'Already have an account? '}
              <Link
                component={MyLink}
                link="/login"
                href="/login"
                className={classes.link}
              >
                Sign in
              </Link>
            </Typography>
          </div>
        </Paper>
      </main>
    );
  }
}

export default withStyles(styles)(SignUpForm);
