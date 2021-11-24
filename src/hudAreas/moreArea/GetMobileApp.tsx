import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import LoadImg from '../../components/LoadImg/LoadImg';
import ImageAppPhone from '../../assets/img/getappphone.png';
import ImageAppIos from '../../assets/img/getappios.png';
import ImageAppAndroid from '../../assets/img/getappandroid.png';
import ImageQrCode from '../../assets/img/getappqrcode.png';
import { useStyles } from './GetMobileAppStyles';
import { MOBILE_APP_ANDROID_URL, MOBILE_APP_IOS_URL } from '../../constants/app';

const GetMobileApp = () => {
  const classes = useStyles();
  return (
    <Grid container className={classes.container} justifyContent="center">
      <Grid item xs={12} md={6} lg={4} xl={3} className={classes.imageContainer}>
        <LoadImg url={ImageAppPhone} className={classes.imagePhone} />
        <Typography className={classes.imageMessage}>
          <b>Remember:</b> Allow Push Notifications to get messages!
        </Typography>
      </Grid>
      <Grid item xs={12} md={6} lg={4} xl={3} className={classes.containerText}>
        <Typography className={classes.title}>Get the Mobile App.</Typography>
        <Typography className={classes.subtitle}>
          <b>Message Instantly.</b>
        </Typography>
        <Typography className={classes.description}>
          From quick questions on-the-go, messages between you and your group members, to checking
          reminders while you’re out - the mobile CircleIn app let’s you be the best student you can
          be, anywhere you go.
        </Typography>
        <Typography className={classes.bold}>
          <b>Download the App</b>
        </Typography>
        <Grid container justifyContent="center">
          <a href={MOBILE_APP_IOS_URL}>
            <LoadImg url={ImageAppIos} className={classes.image} />
          </a>
          <a href={MOBILE_APP_ANDROID_URL}>
            <LoadImg url={ImageAppAndroid} className={classes.image} />
          </a>
        </Grid>
        <Typography className={classes.bold}>or scan the QR code</Typography>
        <LoadImg url={ImageQrCode} className={classes.qr} />
      </Grid>
    </Grid>
  );
};

export default GetMobileApp;
