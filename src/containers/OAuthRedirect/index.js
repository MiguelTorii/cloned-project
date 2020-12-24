// @flow

import React, { useMemo, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import store from 'store'
import { redirectNonce } from 'api/utils'
import type { State as StoreState } from '../../types/state';
import { signLMSUser } from '../../api/lms';
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
  // user: UserState,
  code: string,
  state: string,
  updateUser: Function,
  pushTo: Function
};

const OAuthRedirect = ({
  code,
  state,
  classes,
  updateUser,
  pushTo,
  // user
}: Props) => {
  const roleId = useMemo(() => {
    return store.get('ROLE') === 'faculty' ? 2 : 1
  }, [])

  useEffect(() => {
    const init = async () => {
      try {
        const res = Buffer.from(state, 'hex').toString('utf8');
        const jRes = JSON.parse(res);
        const grantType = 'authorization_code';

        const user = await signLMSUser({
          code,
          grantType,
          clientId: jRes.client_id,
          roleId,
          lmsTypeId: jRes.lms_type_id,
          redirectUri: jRes.redirect_uri
        });

        const redirected = redirectNonce(user)
        if (redirected) return

        updateUser({ user });

        if (!user.userId) pushTo('/new')
        else pushTo('/')
      } catch (err) {
        pushTo('/new');
      }
    }

    init()
  } ,[code, pushTo, roleId, state, updateUser])

  return (
    <main className={classes.main}>
      <CircularProgress />
    </main>
  );
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
)(withStyles(styles)(OAuthRedirect))
