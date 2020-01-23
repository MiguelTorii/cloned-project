// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import amazonLogo from '../../assets/svg/amazon_logo.svg';
import trophy from '../../assets/svg/trophy.svg';
// import ring from '../../assets/svg/ring.svg';
import appLogo from '../../assets/svg/app-logo.svg';

const styles = theme => ({
  circleIn: {
    color: theme.circleIn.palette.action
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

class HowDoIEarnPoints extends React.PureComponent<Props> {
  render() {
    const { classes, open, onClose } = this.props;
    return (
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        aria-labelledby="how-earn-points-dialog-title"
        aria-describedby="how-earn-points-dialog-description"
      >
        <DialogContent>
          <DialogContentText
            id="video-points-description"
            className={classes.circleIn}
            variant="h4"
            paragraph
          >
            CircleIn
          </DialogContentText>
          <DialogContentText
            id="video-points-description"
            color="textPrimary"
            paragraph
          >
            Students are constantly prepping for the next exam, assignment, or
            project. CircleIn is your platform to connect with classmates and
            give or get help, earning real-life rewards as you go!
          </DialogContentText>
          <DialogContentText
            id="video-points-description"
            color="textPrimary"
            variant="h5"
            paragraph
          >
            Your Month
          </DialogContentText>
          <div className={classes.content}>
            <img
              src={amazonLogo}
              alt="Amazon"
              className={classes.contentIcon}
            />
            <DialogContentText
              id="video-points-description"
              color="textPrimary"
              paragraph
            >
              Every 1st Tuesday of the month, your points are automatically
              converted into your top picks. Let us know what your three
              most-wanted rewards are by heading to the Rewards Store and
              placing them inside of the Top Three slots!
            </DialogContentText>
          </div>
          <DialogContentText
            id="video-points-description"
            color="textPrimary"
            variant="h5"
            paragraph
          >
            Season Grand Prize
          </DialogContentText>
          <div className={classes.content}>
            <img src={trophy} alt="Trophy" className={classes.contentIcon} />
            <DialogContentText
              id="video-points-description"
              color="textPrimary"
              paragraph
            >
              Your season stats are important to you, not only because it tracks
              your performance on CircleIn, but because it leads to something
              awesome... the Season Grand Prize! To check your current season
              stats, head to the Home screen. To view all your season stats,
              head to the Profile.
            </DialogContentText>
          </div>
          {/* <DialogContentText
              id="video-points-description"
              color="textPrimary"
              variant="h5"
              paragraph
            >
              Study Packets
            </DialogContentText>
            <div className={classes.content}>
              <img
                src={studyPacketCard}
                alt="Study Packet Card"
                className={classes.contentIcon}
              />
              <DialogContentText
                id="video-points-description"
                color="textPrimary"
                paragraph
              >
                Every week, CircleIn finds and collects the best posts created
                by your classmates and turns them into a study packet just for
                you!
              </DialogContentText>
            </div> */}
          {/* <DialogContentText
            id="video-points-description"
            color="textPrimary"
            variant="h5"
            paragraph
          >
            Daily Streaks
          </DialogContentText>
          <div className={classes.content}>
            <img src={ring} alt="Ring" className={classes.contentIcon} />
            <DialogContentText
              id="video-points-description"
              color="textPrimary"
              paragraph
            >
              Students are studying Sunday through Saturday. That’s why we
              reward you when you log in every day of the week. The Daily Streak
              Ring represents an entire week using CircleIn. Every time you
              complete the ring, we give you a total of 150,000 points to let
              you know you’re awesome!
            </DialogContentText>
          </div> */}
          <DialogContentText
            id="video-points-description"
            color="textPrimary"
            variant="h5"
            paragraph
          >
            CircleIn App
          </DialogContentText>
          <div className={classes.content}>
            <img
              src={appLogo}
              alt="CircleIn App"
              className={classes.contentIcon}
            />
            <DialogContentText
              id="video-points-description"
              color="textPrimary"
              paragraph
            >
              Just like you enjoy our web version, you can download the app by
              going to your app store, searching CircleIn and then just login.
              Much success!
            </DialogContentText>
          </div>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Ok
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    );
  }
}

export default withStyles(styles)(HowDoIEarnPoints);
