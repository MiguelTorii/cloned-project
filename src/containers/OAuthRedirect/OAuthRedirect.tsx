import React, { useMemo, useEffect } from 'react';

import { push } from 'connected-react-router';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';

import * as signInActions from 'actions/sign-in';
import { signLMSUser } from 'api/lms';

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
  search: string;
  updateUser?: (...args: Array<any>) => any;
  pushTo?: (...args: Array<any>) => any;
};
const origin = window.location.origin.includes('dev')
  ? 'https://insights-dev.circleinapp.com/oauth'
  : 'https://insights.circleinapp.com/oauth';

const OAuthRedirect = ({ search, classes, updateUser, pushTo }: Props) => {
  const { state, code } = useMemo(() => queryString.parse(search), [search]);
  useEffect(() => {
    const init = async () => {
      try {
        const res = Buffer.from(state as any, 'hex').toString('utf8');
        const jRes = JSON.parse(res);
        const grantType = 'authorization_code';
        const user = await signLMSUser({
          code: code as string,
          grantType,
          dashboard: Boolean(jRes.dashboard),
          clientId: jRes.client_id,
          lmsTypeId: jRes.lms_type_id,
          redirectUri: jRes.redirect_uri
        });

        if (jRes.dashboard) {
          window.location.href = `${origin}?nonce=${user.nonce}`;
          return;
        }

        updateUser({
          user
        });
        pushTo('/', {
          error: !user.jwtToken
        });
      } catch (err) {
        console.log(err);
        pushTo('/', {
          error: true
        });
      }
    };

    init();
  }, [code, pushTo, state, updateUser]);
  return (
    <main className={classes.main}>
      <CircularProgress />
    </main>
  );
};

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
)(withStyles(styles as any)(OAuthRedirect));
