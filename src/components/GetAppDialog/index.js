// @flow
import React from 'react'
import Dialog from 'components/Dialog'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import getappqrcode from 'assets/img/getappqrcode.png'
import getappandroid from 'assets/img/getappandroid.png'
import getappios from 'assets/img/getappios.png'
import getappphone from 'assets/img/getappphone.png'
import LoadImg from 'components/LoadImg'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(0, 2, 5, 2)
  },
  containerText: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 48
  },
  subtitle: {
    fontSize: 48,
    fontStyle: 'italic'
  },
  description: {
    fontSize: 16,
    maxWidth: 398,
  },
  bold: {
    fontSize: 18,
    margin: theme.spacing(2, 0),
    fontWeight: 800,
  },
  image: {
    margin: theme.spacing(0, 2),
  },
  qr: {
    objectFit: 'scale-down',
    width: 133,
  },
  imageContainer: {
    position: 'relative',
  },
  imageMessage: {
    position: 'absolute',
    bottom: 36,
    padding: theme.spacing(2),
    fontSize: 18,
    left: 26,
    backgroundColor: 'rgba(0, 133, 255, 0.67)',
    borderRadius: 20,
    width: 188,
  },
  imagePhone: {
    objectFit: 'scale-down',
    width: 419,
    [theme.breakpoints.down('xs')]: {
      width: '50vw',
    }
  }
}))

type Props = {
  open: boolean, onClose: Function
};

const GetAppDialog = ({ open, onClose }: Props) => {
  const classes = useStyles()
  return (
    <Dialog
      fullWidth
      maxWidth='md'
      onCancel={onClose}
      open={open}
    >
      <Grid container className={classes.container}>
        <Grid xs={12} md={6} className={classes.imageContainer}>
          <LoadImg url={getappphone} className={classes.imagePhone} />
          <Typography className={classes.imageMessage}><b>Remember:</b> Allow Push Notifications to get messages!</Typography>
        </Grid>
        <Grid xs={12} md={6} className={classes.containerText}>
          <Typography className={classes.title}>Get the Mobile App.</Typography>
          <Typography className={classes.subtitle}><b>Message Instantly.</b></Typography>
          <Typography className={classes.description}>From quick questions on-the-go, messages between you and your group members, to checking reminders while you’re out - the mobile CircleIn app let’s you be the best student you can be, anywhere you go.</Typography>
          <Typography className={classes.bold}><b>Download the App</b></Typography>
          <Grid container justify='center'>
            <a href="https://apps.apple.com/us/app/circlein-circle-in-daily/id969803973">
              <LoadImg url={getappios} className={classes.image} />
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.circlein.android&hl=en_US">
              <LoadImg url={getappandroid} className={classes.image} />
            </a>
          </Grid>
          <Typography className={classes.bold}>or scan the QR code</Typography>
          <LoadImg url={getappqrcode} className={classes.qr} />
        </Grid>
      </Grid>
    </Dialog>
  )
}

export default GetAppDialog
