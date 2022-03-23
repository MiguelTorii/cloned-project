import React from 'react';

import Typography from '@material-ui/core/Typography';

import { MOBILE_APP_ANDROID_URL, MOBILE_APP_IOS_URL } from 'constants/app';

import ImageAppAndroid from 'assets/img/getappandroid.png';
import ImageAppIos from 'assets/img/getappios.png';
import ImageAppPhone from 'assets/img/getappphone.png';
import ImageQrCode from 'assets/img/getappqrcode.png';
import LoadImg from 'components/LoadImg/LoadImg';

import { useStyles } from './GetMobileAppStyles';

const GetMobileApp = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.imageContainer}>
        <Typography className={classes.imageMessage}>
          <b>Remember:</b> Allow Push Notifications to get messages!
        </Typography>
        <LoadImg url={ImageAppPhone} className={classes.imagePhone} />
      </div>
      <div className={classes.containerText}>
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
        <div>
          <a href={MOBILE_APP_IOS_URL}>
            <LoadImg url={ImageAppIos} className={classes.image} />
          </a>
          <a href={MOBILE_APP_ANDROID_URL}>
            <LoadImg url={ImageAppAndroid} className={classes.image} />
          </a>
        </div>
        <Typography className={classes.bold}>or scan the QR code</Typography>
        <LoadImg url={ImageQrCode} className={classes.qr} />
      </div>
    </div>
  );
};

export default GetMobileApp;
