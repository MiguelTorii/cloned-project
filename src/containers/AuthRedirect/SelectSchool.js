// @flow
import React, { memo, useState, useCallback } from 'react'
import AutoComplete from 'components/AutoComplete';
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { searchSchools } from 'api/sign-in';
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID } from 'constants/app'
import auth0 from 'auth0-js'

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent:'center',
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(2),
  },
  schools: {
    width: '100%',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  }
}))

const SelectSchool = ({ updateError, school, setScreen, updateSchool }) => {
  const classes = useStyles()
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const onLoad = useCallback(async value => {
    setError(false)

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

  const onChange = useCallback(value => {
    updateSchool({ school: value });
  }, [updateSchool])

  const onClick = useCallback(() => {
    setLoading(true)
    if (!school) {
      setLoading(false)
      return false
    }

    const { lmsTypeId, launchType, redirect_message: redirectMessage, connection } = school;
    // if (true) {
    // updateError({
    // title: 'You are early and we love it!',
    // body: "Please type in your email to be notified when it goes live.",
    // action: 'email'
    // })
    // setLoading(false)
    // return
    // }
    if (launchType === 'lti') {
      updateError({
        title: '',
        body: redirectMessage
      })

      setLoading(false)
      return false
    } if (lmsTypeId === 0) {
      /* NONE */
      setLoading(false)
    } else if (lmsTypeId === -1) {
      setLoading(false)
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
      })
      setLoading(false)
      return true
    } else {
      setScreen('walk')
      setLoading(false)
      return true
    }
    setLoading(false)
    setScreen('login')
    return false
  }, [school, setScreen, updateError])

  const onSubmit = useCallback(e => {
    e.preventDefault()
    onClick()
  }, [onClick])

  return (
    <div className={classes.container}>
      <Typography component="h1" variant="h5" align="center">
        Find your school
      </Typography>
      <form onSubmit={onSubmit} className={classes.schools}>
        <AutoComplete
          inputValue=""
          label=""
          placeholder="Search your school/college"
          error={error}
          values={school}
          errorText="You must select an option"
          isSchoolSearch
          onChange={onChange}
          onLoadOptions={onLoad}
        />
      </form>
      <Button
        variant='contained'
        onClick={onClick}
        disabled={!school || loading}
        color='primary'
      >
        {loading
          ? <CircularProgress size={20} color='secondary' />
          : 'Select School'
        }
      </Button>
    </div>
  )
}

export default memo(SelectSchool)
