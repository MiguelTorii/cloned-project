// @flow

import React, { useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import auth0 from 'auth0-js'
import type { State as StoreState } from '../../types/state';
import ErrorBoundary from '../ErrorBoundary';
import loginBackground from '../../assets/img/login-background.png';
import AuthSearchSchool from '../../components/AuthSearchSchool';
import { searchSchools } from '../../api/sign-in';
import * as authActions from '../../actions/auth';
import { REDIRECT_URI } from '../../constants/app';
import Dialog from '../../components/Dialog';
import { ReactComponent as AppLogo } from '../../assets/svg/circlein_logo.svg';

const styles = theme => ({
  main: {
    minHeight: '100vh',
    backgroundImage: `url(${loginBackground})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '50% 0',
    '-ms-background-size': 'cover',
    '-o-background-size': 'cover',
    '-moz-background-size': 'cover',
    '-webkit-background-size': 'cover',
    backgroundSize: 'cover'
  },
  grid: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  logo: {
    marginTop: theme.spacing(8)
  }
});

type Props = {
  classes: Object,
  pushTo: Function,
  updateSchool: Function
};
const Auth = ({ classes, pushTo, updateSchool }: Props) => {
  const [school] = useState(null)
  const [error] = useState(false)
  const [lti, setLit] = useState(false)
  const [redirectMessage, setRedirectMessage] = useState(false)

  const handleChange = useCallback(value => {
    if (!value) return;
    const { lmsTypeId, launchType, redirect_message: redirectMessage } = value;
    if (launchType === 'lti') {
      setLit(true)
      setRedirectMessage(redirectMessage)
    } else if (lmsTypeId === 0) {
      const { label, value: selectValue, ...school } = value;
      updateSchool({ school });
      pushTo('/login')
    } else if (lmsTypeId === -1) {
      window.location.replace('https://circleinapp.com/whitelist');
    } else if (value.id === 55) {
      const webAuth = new auth0.WebAuth({
        domain:       'circlein-dev.us.auth0.com',
        clientID:     'Bps2iaRf3iIxDeTVJa9zOQI20937s7Dj'
      });
      webAuth.authorize({
        audience: 'https://circlein-dev.us.auth0.com/api/v2/',
        redirectUri: `${window.location.origin}/saml`,
        connection: 'Test-Columbia-College',
        responseType: 'token'
      })
    } else {
      const responseType = 'code';
      const obj = {
        uri: value.uri,
        lms_type_id: value.lmsTypeId,
        response_type: responseType,
        client_id: value.clientId,
        redirect_uri: REDIRECT_URI
      };

      const buff = Buffer.from(JSON.stringify(obj)).toString('hex');

      let uri = `${value.authUri}?client_id=${
        value.clientId
      }&response_type=${responseType}&redirect_uri=${REDIRECT_URI}&state=${buff}`;

      if (value.scope) {
        uri = `${uri}&scope=${value.scope}`;
      }

      window.location.replace(uri);
    }
  }, [pushTo, updateSchool])

  const handleLoadOptions = useCallback(async value => {
    if (value.trim().length > 1) {
      const schools = await searchSchools({ query: value });

      const options = schools.map(school => ({
        value: school.clientId,
        label: school.school,
        noAvatar: true,
        ...school
      }));

      return {
        options,
        hasMore: false
      };
    }
    return {
      options: [],
      hasMore: false
    };
  }, [])

  const handleClose = useCallback(() => setLit(false), [])

  return (
    <main className={classes.main}>
      <Grid container justify="space-around">
        <Grid item xs={12} lg={6}>
          <div className={classes.grid}>
            <AppLogo style={{ maxHeight: 100, maxWidth: 200 }} />
            <ErrorBoundary>
              <AuthSearchSchool
                school={school}
                error={error}
                onChange={handleChange}
                onLoad={handleLoadOptions}
              />
            </ErrorBoundary>
          </div>
        </Grid>
      </Grid>
      <Dialog
        onCancel={handleClose}
        onOk={handleClose}
        open={lti}
        showActions
      >
        <div className={classes.content}>
          <Typography color="textPrimary">{redirectMessage}</Typography>
        </div>
      </Dialog>
    </main>
  );
}

const mapStateToProps = ({ user, auth }: StoreState): {} => ({
  user,
  auth
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      updateSchool: authActions.updateSchool,
      pushTo: push
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Auth));
