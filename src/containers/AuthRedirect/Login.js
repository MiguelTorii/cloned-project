// @flow
import React, { memo, useCallback, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import LoadImg from 'components/LoadImg'
import getappqrcode from 'assets/img/getappqrcode.png'
import getappandroid from 'assets/img/getappandroid.png'
import getappios from 'assets/img/getappios.png'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent:'center',
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(2),
  },
  qr: {
    width: 208,
    margin: theme.spacing(3, 0),
    objectFit: 'scale-down'
  },
  scanText: {
    marginTop: theme.spacing(4),
    fontWeight: 800,
    fontSize: 12,
    textAlign: 'center'
  },
  signup: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textField: {
    margin: theme.spacing(2)
  },
  loginButton: {
    marginTop: theme.spacing(2),
    width: 160
  },
  orButton: {
    minWidth: 0
  },
  scanContainer: {
    alignItems: 'center',
    justifyContent:'center',
    display: 'flex',
    flexDirection: 'column',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
  }
}))

const Login = ({
  role,
  setScreen,
  school,
  signIn
}) => {
  const classes = useStyles()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onLogin = useCallback(() => {
    const { id: schoolId } = school
    signIn({ email, password, schoolId, role })
  }, [email, password, role, school, signIn])

  const goSignup = useCallback(() => {
    setScreen('signup')
  } ,[setScreen])

  const onChange = useCallback(field => e => {
    if(e?.target?.value) {
      const { value } = e.target
      if (field === 'email') setEmail(value)
      if(field === 'password') setPassword(value)
    }
  }, [])

  const onSubmit = useCallback(e => {
    e.preventDefault()
    onLogin()
  }, [onLogin])

  return (
    <div className={classes.container}>
      <form onSubmit={onSubmit} className={classes.form}>
        <TextField
          id='email-login'
          className={classes.textField}
          value={email}
          onChange={onChange('email')}
          autoComplete='on'
          fullWidth
          placeholder='Email'
        />
        <TextField
          id='password-login'
          autoComplete='on'
          value={password}
          type='password'
          onChange={onChange('password')}
          className={classes.textField}
          placeholder='Password'
          fullWidth
        />
        <Button
          className={classes.loginButton}
          variant='contained'
          type='submit'
          onClick={onLogin}
          color='primary'
        >
        Login
        </Button>
      </form>
      <div className={classes.signup}>
        <Typography>Or, </Typography>
        <Button
          onClick={goSignup}
          className={classes.orButton}
          disableElevation
          disableFocusRipple
          disableRipple
        >
        Sign Up
        </Button>
      </div>
      {['student', 'tutor'].includes(role) && (
        <div className={classes.scanContainer}>
          <Typography className={classes.scanText}>
        Scan to download CircleIn Mobile - great for messaging classmates!
          </Typography>
          <LoadImg url={getappqrcode} className={classes.qr} />
          <Grid container justify='space-around'>
            <a href="https://apps.apple.com/us/app/circlein-circle-in-daily/id969803973">
              <LoadImg url={getappios} className={classes.image} />
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.circlein.android&hl=en_US">
              <LoadImg url={getappandroid} className={classes.image} />
            </a>
          </Grid>
        </div>
      )}
    </div>
  )
}

export default memo(Login)
