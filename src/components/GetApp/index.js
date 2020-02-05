// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

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
    // width: '30vw',
    height: 45 
  },
  downloadAndroidButton: {
    display: 'block',
    color: '#000000',
    textDecoration: 'none',
    fontFamily: 'Helvetica, arial, sans-serif',
    fontSize: 16,
    // width: '35vw', 
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
    // justifyContent: 'space-around'
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  contentIcon: {
    marginRight: theme.spacing(),
    marginBottom: theme.spacing(2),
    height: 40
  }
});

type Props = {
  classes: Object,
  open: boolean,
  onClose: Function
};

const GetApp = (props: Props) => {
  const { classes, open, onClose } = props;
  const {innerWidth} = window
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="get-app-dialog-title"
      aria-describedby="get-app-dialog-description"
    >
      <DialogContent>
        <DialogContentText
          className={classes.circleIn}
          variant="h4"
          paragraph
        >
            CircleIn Mobile App
        </DialogContentText>
        <DialogContentText
          color="textPrimary"
          paragraph
        >
The app is great for posting a picture of your notes for points, direct or group messaging with classmates, getting notifications and reminders, and checking your points on the go.
        </DialogContentText>
        <DialogContentText
          color="textPrimary"
          paragraph
        >
The web version is great for: sharing google docs of your notes for points, doing video study sessions for points, viewing what your classmates have shared with everyone, and creating flashcards for points.
        </DialogContentText>
        <DialogContentText
          color="textPrimary"
          paragraph
        >Download the app now</DialogContentText>
        <DialogContentText
          className={innerWidth < 800 ? classes.downloadColumn : classes.downloads}
          color="textPrimary"
          paragraph
        >
          <div><a href="https://apps.apple.com/us/app/circlein-circle-in-daily/id969803973"><img className={classes.downloadIosButton} border="0" width="149" alt="" data-proportionally-constrained="true" data-responsive="true" src="http://cdn.mcauto-images-production.sendgrid.net/4a7a15b7d82f3753/a40dbfa4-1724-44ac-9ebd-220f15ad4287/728x253.jpg" /></a></div>
          <div><a href="https://play.google.com/store/apps/details?id=com.circlein.android&amp;hl=en_US"><img className={classes.downloadAndroidButton} border="0" width="149" alt="" data-proportionally-constrained="true" data-responsive="true" src="http://cdn.mcauto-images-production.sendgrid.net/4a7a15b7d82f3753/8646c562-afbf-4953-b52b-9c72adccc2d9/564x168.png" /></a></div>

        </DialogContentText>
        <DialogActions>
          <Button onClick={onClose} color="primary">
              Ok
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

export default withStyles(styles)(GetApp);
