// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import SignUpForm from '../../components/SignUpForm';
import SimpleErrorDialog from '../../components/SimpleErrorDialog';
import type { State as StoreState } from '../../types/state';
import type { UserState } from '../../reducers/user';
import * as signInActions from '../../actions/sign-in';

const styles = () => ({});

type ProvidedProps = {
  classes: Object
};

type Props = {
  user: UserState,
  //   signIn: Function,
  clearError: Function
};

type State = {
  email: string,
  password: string
};

class SignUp extends React.Component<ProvidedProps & Props, State> {
  state = {
    email: '',
    password: ''
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

  handleSubmit = () => {
    // const { signIn } = this.props;
    // signIn(this.state);
  };

  handleErrorDialogClose = () => {
    const { clearError } = this.props;
    clearError();
  };

  render() {
    const { classes, user } = this.props;
    const { email, password } = this.state;
    const { error, errorMessage, isLoading } = user;
    const { title, body } = errorMessage;

    return (
      <main className={classes.main}>
        <SignUpForm
          email={email}
          password={password}
          loading={isLoading}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
        />
        <SimpleErrorDialog
          open={error}
          title={title}
          body={body}
          handleClose={this.handleErrorDialogClose}
        />
      </main>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      signIn: signInActions.signIn,
      clearError: signInActions.clearSignInError
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SignUp));
