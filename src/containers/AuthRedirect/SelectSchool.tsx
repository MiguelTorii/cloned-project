import React, { memo, useState, useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import auth0 from 'auth0-js';
import Link from '@material-ui/core/Link';
import { Box, Grid } from '@material-ui/core';
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID, GONDOR_URL } from '../../constants/app';
import { searchSchools } from '../../api/sign-in';
import AutoComplete from '../../components/AutoComplete/AutoComplete';
import SemiBoldTypography from '../../components/SemiBoldTypography/SemiBoldTypography';
import AuthButton from './AuthButton';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(2)
  },
  schools: {
    width: '100%',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  link: {
    fontSize: 12,
    fontWeight: 600,
    marginTop: theme.spacing(4)
  },
  externalUser: {
    color: theme.circleIn.palette.black,
    fontWeight: 600,
    marginTop: theme.spacing(2),
    textTransform: 'inherit',
    '& span': {
      fontSize: 14,
      textDecoration: 'underline'
    }
  }
}));

const SelectSchool = ({
  updateError,
  school,
  setScreen,
  isDeepLink,
  updateSchool,
  setLoginAsExternalUser,
  setDeeplinkLoading
}) => {
  const classes: any = useStyles();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const onLoad = useCallback(async (value) => {
    setError(false);

    if (value.trim().length > 1) {
      const schools = await searchSchools({
        query: value
      });
      const options = schools.map((school) => ({
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
  }, []);
  const onChange = useCallback(
    (value) => {
      updateSchool({
        school: value
      });
    },
    [updateSchool]
  );
  const onClick = useCallback(() => {
    setLoading(true);

    if (!school) {
      setLoading(false);
      return false;
    }

    const { lmsTypeId, launchType, redirect_message: redirectMessage, connection } = school;

    if (school.studentLive === 0) {
      setDeeplinkLoading(false);
      updateError({
        title: "You're early and we love it!",
        body: 'Type in your email and we will notify you when CircleIn goes live at your school!',
        action: 'email'
      });
      setLoading(false);
      return false;
    }

    if (launchType === 'lti') {
      setDeeplinkLoading(false);
      updateError({
        title: '',
        body: redirectMessage
      });
      setLoading(false);
      return false;
    }

    if (launchType === 'gondor') {
      const redirectUrl = `${window.location.origin}/gondor`;
      window.location.href = `${GONDOR_URL}/sso/startauth/school/${school.id}?redirect_to=${redirectUrl}`;
      return true;
    }

    if (lmsTypeId === 0) {
      /* NONE */
      setLoading(false);
      setDeeplinkLoading(false);
    } else if (lmsTypeId === -1) {
      setLoading(false);
      window.location.replace('https://circleinapp.com/whitelist');
    } else if (launchType === 'saml') {
      const webAuth = new auth0.WebAuth({
        domain: AUTH0_DOMAIN,
        clientID: AUTH0_CLIENT_ID
      });
      webAuth.authorize({
        audience: `https://${AUTH0_DOMAIN}/api/v2/`,
        redirectUri: `${window.location.origin}/saml`,
        connection,
        responseType: 'token'
      });
      setDeeplinkLoading(false);
      setLoading(false);
      return true;
    } else {
      const responseType = 'code';
      const origin = `${window.location.origin}/oauth`;
      const obj = {
        uri: school.uri,
        lms_type_id: school.lmsTypeId,
        response_type: responseType,
        client_id: school.clientId,
        redirect_uri: origin
      };
      const buff = Buffer.from(JSON.stringify(obj)).toString('hex');
      let uri = `${school.authUri}?client_id=${school.clientId}&response_type=${responseType}&redirect_uri=${origin}&state=${buff}`;

      if (school.scope) {
        uri = `${uri}&scope=${school.scope}`;
      }

      setLoading(false);
      window.location.replace(uri);
      return true;
    }

    setLoading(false);
    setDeeplinkLoading(false);
    setScreen('login');
    return false;
  }, [school, setScreen, updateError, setDeeplinkLoading]);
  // Deep link to specific school
  useEffect(() => {
    if (isDeepLink && school?.id) {
      onClick();
    }
  }, [school, isDeepLink, onClick]);
  const loginAsExternal = useCallback(() => {
    setLoginAsExternalUser(true);
    setScreen('login');
  }, [setLoginAsExternalUser, setScreen]);
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onClick();
    },
    [onClick]
  );
  return (
    <div className={classes.container}>
      <Box mb={4}>
        <Typography component="h1" variant="h4" align="center">
          <b>{"Glad you're here!"}</b>
        </Typography>
      </Box>
      <SemiBoldTypography variant="h6" align="center">
        Please enter your school name to login
      </SemiBoldTypography>
      <form onSubmit={onSubmit} className={classes.schools}>
        <AutoComplete
          inputValue=""
          label=""
          placeholder="School Name"
          error={error}
          values={school}
          errorText="You must select an option"
          isSchoolSearch
          onChange={onChange}
          onLoadOptions={onLoad}
        />
      </form>
      <Box mt={3}>
        <AuthButton variant="contained" onClick={onClick} disabled={!school?.id || loading}>
          {loading ? <CircularProgress size={20} color="secondary" /> : 'Select School'}
        </AuthButton>
      </Box>

      <Button onClick={loginAsExternal} className={classes.externalUser} color="primary">
        Login as an external user
      </Button>

      <Grid container justifyContent="center">
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" className={classes.link} align="center">
            {"By searching for and selecting your school, I agree to CircleIn's  "}
            <Link
              href="https://s3.amazonaws.com/myqvo/terms_of_use.pdf"
              target="_blank"
              color="inherit"
              underline="always"
            >
              Terms of Service
            </Link>
            {' and '}
            <Link
              href="https://s3.amazonaws.com/myqvo/privacy_policy.pdf"
              target="_blank"
              color="inherit"
              underline="always"
            >
              Privacy Policy
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default memo(SelectSchool);
