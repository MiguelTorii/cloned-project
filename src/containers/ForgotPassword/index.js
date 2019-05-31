// @flow

import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ForgotPasswordForm from '../../components/ForgotPasswordForm';
import SimpleErrorDialog from '../../components/SimpleErrorDialog';
import ErrorBoundary from '../ErrorBoundary';
import { recoverPassword } from '../../api/sign-in';

const styles = theme => ({
  success: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.unit * 2
  }
});

type Props = {
  classes: Object
};

type State = {
  email: string,
  loading: boolean,
  success: boolean,
  error: boolean,
  title: string,
  body: string
};

class ForgotPassword extends React.Component<Props, State> {
  state = {
    email: '',
    loading: false,
    success: false,
    error: false,
    title: '',
    body: ''
  };

  handleChange = (field: string) => (
    // eslint-disable-next-line no-undef
    event: SyntheticEvent<HTMLInputElement>
  ) => {
    const { target } = event;
    // eslint-disable-next-line no-undef
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    this.setState({
      [field]: target.value
    });
  };

  handleSubmit = async () => {
    const { email } = this.state;
    try {
      this.setState({ loading: true });
      const success = await recoverPassword({ email });
      if (success) {
        this.setState({ success: true });
      } else {
        this.setState({
          error: true,
          title: 'Error Recovering Password',
          body: "We couldn't process your request, please try again"
        });
      }
    } catch (err) {
      console.log(err);
      this.setState({
        error: true,
        title: 'Error Recovering Password',
        body: "We couldn't process your request, please try again"
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleErrorDialogClose = () => {
    this.setState({ error: false, title: '', body: '' });
  };

  render() {
    const { classes } = this.props;
    const { email, loading, error, title, body, success } = this.state;

    return (
      <main className={classes.main}>
        <Grid container justify="space-around">
          <Grid item xs={6}>
            {success ? (
              <div className={classes.success}>
                <Typography align="center" variant="h5">
                  We have sent you an email, please follow the link inside to
                  reset your password
                </Typography>
              </div>
            ) : (
              <ErrorBoundary>
                <ForgotPasswordForm
                  email={email}
                  loading={loading}
                  onChange={this.handleChange}
                  onSubmit={this.handleSubmit}
                />
              </ErrorBoundary>
            )}
          </Grid>
        </Grid>
        <ErrorBoundary>
          <SimpleErrorDialog
            open={error}
            title={title}
            body={body}
            handleClose={this.handleErrorDialogClose}
          />
        </ErrorBoundary>
      </main>
    );
  }
}

export default withStyles(styles)(ForgotPassword);
