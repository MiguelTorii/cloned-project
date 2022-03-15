import React, { useEffect, useMemo } from 'react';
import { useHistory, withRouter } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import store from 'store';

import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import { Box, CircularProgress } from '@material-ui/core';

import withRoot from '../../withRoot';
import Auth from '../../containers/AuthRedirect/Auth';
import { masquerade } from '../../actions/user';
import { VIRAL_LOOP_SOURCE_PREFIX } from 'constants/common';
import { STORAGE_KEYS } from 'constants/app';
import { apiLogViralLoopEmailClicked } from 'api/viral_loop';

const styles = () => ({});

type Props = {
  classes: Record<string, any>;
  location: {
    state: Record<string, any>;
    pathname: string;
    search: string;
  };
};

const AuthPage = ({ classes, location: { search, state, pathname } }: Props) => {
  /** *
   * Logic for masquerading starts
   ** */
  const dispatch = useDispatch();
  const history = useHistory();
  const userData = useSelector((state) => (state as any).user.data);
  const { userId, refreshToken, email, source } = useMemo(() => {
    const query = new URLSearchParams(search);
    return {
      userId: query.get('user_id'),
      refreshToken: query.get('refresh_token'),
      email: query.get('acting_user_email'),
      source: query.get('source')
    };
  }, [search]);
  const isMasquerading = !!(pathname === '/auth' && userId && refreshToken && email);
  // Check if there are parameters for masquerading
  useEffect(() => {
    if (!isMasquerading) {
      return;
    }

    dispatch(masquerade(userId, refreshToken, (isAuth) => !isAuth && history.push('/'))); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // After the user is authenticated with the refresh token, it redirects to the home page.
  useEffect(() => {
    if (isMasquerading && userData.userId) {
      history.push('/');
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMasquerading, userData]);

  if (isMasquerading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  // Check if the page is visited from viral loop email.
  useEffect(() => {
    if (userId && source && source.startsWith(VIRAL_LOOP_SOURCE_PREFIX)) {
      const viralLoopType = source.substring(VIRAL_LOOP_SOURCE_PREFIX.length);

      // Store `viralLoopType` for checking after login.
      store.set(STORAGE_KEYS.VIRAL_LOOP_TYPE, viralLoopType);

      // Call Logging API
      apiLogViralLoopEmailClicked(Number(userId), viralLoopType);
    }
  }, [userId, source]);

  /** *
   * Logic for masquerading ends
   ** */
  return (
    <main className={classes.main}>
      <CssBaseline />
      <Auth state={state} search={search} pathname={pathname} />
    </main>
  );
};

export default withRouter(withRoot(withStyles(styles as any)(AuthPage)));
