// @flow

import React from 'react';
import cx from 'classnames';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { styles } from '../_styles/SignUpForm/VerifyAccount';

type Props = {
  classes: Object,
  email: string,
  loading: boolean,
  hide: boolean,
  onBack: Function,
  onResend: Function,
  onSubmit: Function
};

type State = {
  code: string
};

class VerifyAccount extends React.PureComponent<Props, State> {
  state = {
    code: ''
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleResendCode = () => {
    const { email, onResend } = this.props;
    onResend(email);
  };

  handleSubmit = () => {
    const { onSubmit, email } = this.props;
    const { code } = this.state;
    const data = {
      action: 'VerifyAccount',
      data: {
        email,
        code
      }
    };
    onSubmit(data);
  };

  render() {
    const { classes, email, loading, hide, onBack } = this.props;
    const { code } = this.state;
    return (
      <ValidatorForm
        onSubmit={this.handleSubmit}
        className={cx(classes.form, hide && classes.hide)}
      >
        <Typography
          align="center"
          variant="subtitle1"
        >{`We have sent the code to ${email}. It may take several minutes for the code to arrive`}</Typography>
        <TextValidator
          variant="outlined"
          label="Email Address"
          margin="normal"
          name="email"
          autoComplete="email"
          fullWidth
          value={email}
          disabled
          validators={['required', 'isEmail']}
          errorMessages={['Email Address is required', 'email is not valid']}
        />
        <TextValidator
          variant="outlined"
          label="Code"
          margin="normal"
          onChange={this.handleChange('code')}
          name="code"
          autoComplete="code"
          autoFocus
          fullWidth
          value={code}
          disabled={loading}
          validators={['required']}
          errorMessages={['Code is required']}
        />
        <div className={classes.actions}>
          <Button
            variant="contained"
            color="default"
            disabled={loading}
            className={classes.button}
            onClick={onBack}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="default"
            disabled={loading}
            className={classes.button}
            onClick={this.handleResendCode}
          >
            Resend Code
          </Button>
        </div>
        <div className={classes.wrapper}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
          >
            Submit
          </Button>
          {loading && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </div>
      </ValidatorForm>
    );
  }
}

export default withStyles(styles)(VerifyAccount);
