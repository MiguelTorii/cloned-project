// @flow

import React, { useEffect, useMemo } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import { Box, CircularProgress } from '@material-ui/core';
import { useHistory, withRouter } from 'react-router';
import withRoot from '../../withRoot';
import Auth from '../../containers/AuthRedirect';
import { useDispatch, useSelector } from 'react-redux';
import { masquerade } from '../../actions/user';

const styles = () => ({});

type Props = {
  classes: Object,
  location: {
    state: Object,
    pathname: string,
    search: string
  }
};

const AuthPage = ({
  classes,
  location : {
    search,
    state,
    pathname
  }
}: Props) => {
  /***
   * Logic for masquerading starts
   ***/

  const dispatch = useDispatch();
  const history = useHistory();
  const userData = useSelector((state) => state.user.data);
  const { userId, refreshToken, email } = useMemo(() => {
    const query = new URLSearchParams(search);
    return {
      userId: query.get('user_id'),
      refreshToken: query.get('refresh_token'),
      email: query.get('acting_user_email'),
    };
  }, [search]);
  const isMasquerading = !!(pathname === '/auth' && userId && refreshToken && email);

  // Check if there are parameters for masquerading
  useEffect(() => {
    if (!isMasquerading) return ;

    dispatch(
      masquerade(
        userId,
        refreshToken,
        (isAuth) => !isAuth && history.push('/')
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // After the user is authenticated with the refresh token, it redirects to the home page.
  useEffect(() => {
    if (isMasquerading && userData.userId) {
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMasquerading, userData]);

  if (isMasquerading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  /***
   * Logic for masquerading ends
   ***/

  return (
    <main className={classes.main}>
      <CssBaseline />
      <Auth
        state={state}
        search={search}
        pathname={pathname}
      />
    </main>
  );
}

export default withRouter(
  withRoot(withStyles(styles)(AuthPage))
);
