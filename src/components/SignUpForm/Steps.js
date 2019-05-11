// @flow

import React from 'react';
import cx from 'classnames';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  hide: {
    display: 'none'
  }
});

type Props = {
  classes: Object,
  activeStep: number,
  hide: boolean
};

class Steps extends React.PureComponent<Props> {
  render() {
    const { classes, activeStep, hide } = this.props;
    return (
      <div className={cx(classes.form, hide && classes.hide)}>
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
      </div>
    );
  }
}

export default withStyles(styles)(Steps);
