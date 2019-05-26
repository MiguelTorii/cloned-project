// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import { checkCanvasUser } from '../../api/lms';
import * as signInActions from '../../actions/sign-in';

const styles = () => ({
  main: {
    display: 'flex',
    height: '100vh',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

type Props = {
  classes: Object,
  user: UserState,
  nonce: string,
  updateUser: Function,
  pushTo: Function
};

class Canvas extends React.Component<Props> {
  componentDidMount = async () => {
    const { nonce, updateUser, pushTo } = this.props;
    try {
      const user = await checkCanvasUser({
        nonce
      });
      updateUser({ user });
    } catch (err) {
      pushTo('/login');
    }
  };

  render() {
    const {
      classes,
      user: {
        data: { userId }
      }
    } = this.props;
    if (userId !== '') return <Redirect to="/" />;
    return (
      <main className={classes.main}>
        <CircularProgress />
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
      updateUser: signInActions.updateUser,
      pushTo: push
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Canvas));
