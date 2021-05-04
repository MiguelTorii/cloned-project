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

import { useStyles } from '../_styles/GetAppDialog'

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
      open={Boolean(open)}
    >
      <Grid container className={classes.container}>
        <Grid item xs={12} md={6} className={classes.imageContainer}>
          <LoadImg url={getappphone} className={classes.imagePhone} />
          <Typography className={classes.imageMessage}><b>Remember:</b> Allow Push Notifications to get messages!</Typography>
        </Grid>
        <Grid item xs={12} md={6} className={classes.containerText}>
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
