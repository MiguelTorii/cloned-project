// @flow

import React from 'react';
import cx from 'classnames';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';

const styles = theme => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  hide: {
    display: 'none'
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between'
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
  }
});

type Props = {
  classes: Object,
  loading: boolean,
  hide: boolean,
  onBack: Function,
  onSubmit: Function
};

type State = {
  code: string
};

class ReferralCode extends React.PureComponent<Props, State> {
  state = {
    code: ''
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleSubmit = () => {
    const { onSubmit } = this.props;
    const { code } = this.state;
    const data = {
      action: 'ReferralCode',
      data: {
        code
      }
    };
    onSubmit(data);
  };

  render() {
    const { classes, loading, hide, onBack } = this.props;
    const { code } = this.state;
    return (
      <ValidatorForm
        onSubmit={this.handleSubmit}
        className={cx(classes.form, hide && classes.hide)}
      >
        <Typography align="center" variant="subtitle1">
          Did a friend invite you to CircleIn? Enter their referral code and
          your friend will receive 10,000 bonus points. Brilliant!
        </Typography>
        <TextValidator
          variant="outlined"
          label="Referral Code"
          margin="normal"
          onChange={this.handleChange('code')}
          name="code"
          autoComplete="code"
          autoFocus
          fullWidth
          value={code}
          disabled={loading}
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
            onClick={this.handleSubmit}
          >
            Skip
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

export default withStyles(styles)(ReferralCode);
