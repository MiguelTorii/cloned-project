import React from 'react';

import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';

import * as signInActions from 'actions/sign-in';
import { signLMSUser } from 'api/lms';

import type { UserState } from 'reducers/user';
import type { State as StoreState } from 'types/state';

const styles = () => ({
  main: {
    display: 'flex',
    height: '100vh',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

type Props = {
  classes?: Record<string, any>;
  user?: UserState;
  code?: string;
  state?: string;
  search?: string;
  updateUser?: (...args: Array<any>) => any;
  pushTo?: (...args: Array<any>) => any;
};

class OAuth extends React.Component<Props> {
  componentDidMount = async () => {
    const { code, state, search, updateUser, pushTo } = this.props;

    try {
      const res = Buffer.from(state, 'hex').toString('utf8');
      const jRes = JSON.parse(res);
      const grantType = 'authorization_code';
      const user = await signLMSUser({
        code,
        grantType,
        clientId: jRes.client_id,
        lmsTypeId: jRes.lms_type_id,
        redirectUri: jRes.redirect_uri
      });
      updateUser({
        user
      });
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

    if (userId !== '') {
      return <Redirect to="/" />;
    }

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

const mapDispatchToProps = (dispatch: any): {} =>
  bindActionCreators(
    {
      updateUser: signInActions.updateUser,
      pushTo: push
    },
    dispatch
  );

export default connect<{}, {}, Props>(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles as any)(OAuth));
