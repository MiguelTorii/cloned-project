// @flow
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Dialog, { dialogStyle } from '../Dialog';

const styles = theme => ({
  circleIn: {
    color: theme.circleIn.palette.action
  },
  downloadIosButton: {
    display: 'block',
    color:'#000000',
    textDecoration: 'none',
    fontFamily: 'Helvetica, arial, sans-serif',
    fontSize: 16,
    borderRadius: 8,
    margin: 5,
    height: 45
  },
  downloadAndroidButton: {
    display: 'block',
    color: '#000000',
    textDecoration: 'none',
    fontFamily: 'Helvetica, arial, sans-serif',
    fontSize: 16,
    height: 45,
  },
  downloadColumn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  downloads: {
    display: 'flex',
    alignItems: 'center',
  },
  dialog: {
    ...dialogStyle,
    width: 600,
  }
});

type Props = {
  classes: Object,
  open: boolean,
  onClose: Function
};

const GetApp = (props: Props) => {
  const { classes, open, onClose } = props;
  const { innerWidth } = window

  return (
    <Dialog
      className={classes.dialog}
      onCancel={onClose}
      open={open}
      title="CircleIn Mobile App"
    >
      <Typography color="textPrimary" paragraph>
        The app is great for posting a picture of your notes for points, direct or group messaging with classmates, getting notifications and reminders, and checking your points on the go.
      </Typography>
      <Typography color="textPrimary" paragraph>
        The web version is great for: sharing google docs of your notes for points, doing video study sessions for points, viewing what your classmates have shared with everyone, and creating flashcards for points.
      </Typography>
      <Typography color="textPrimary" paragraph>Download the app now</Typography>
      <Typography
        className={innerWidth < 800 ? classes.downloadColumn : classes.downloads}
        color="textPrimary"
        paragraph
      >
        <div>
          <a href="https://apps.apple.com/us/app/circlein-circle-in-daily/id969803973">
            <img
              alt=""
              border="0"
              className={classes.downloadIosButton}
              data-proportionally-constrained="true"
              data-responsive="true"
              src="http://cdn.mcauto-images-production.sendgrid.net/4a7a15b7d82f3753/a40dbfa4-1724-44ac-9ebd-220f15ad4287/728x253.jpg"
              width="149"
            />
          </a>
        </div>
        <div>
          <a href="https://play.google.com/store/apps/details?id=com.circlein.android&amp;hl=en_US">
            <img
              alt=""
              border="0"
              className={classes.downloadAndroidButton}
              data-proportionally-constrained="true"
              data-responsive="true"
              src="http://cdn.mcauto-images-production.sendgrid.net/4a7a15b7d82f3753/8646c562-afbf-4953-b52b-9c72adccc2d9/564x168.png"
              width="149"
            />
          </a>
        </div>
      </Typography>
    </Dialog>
  );
}

export default withStyles(styles)(GetApp);
