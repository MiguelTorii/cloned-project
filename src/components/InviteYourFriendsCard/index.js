// @flow
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    height: '100%'
  },
  img: {
    width: 65,
    margin: theme.spacing.unit * 2
  },
  referral: {
    width: '100%',
    marginTop: theme.spacing.unit * 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  referralCode: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  link: {
    flex: 1,
    height: 40,
    padding: theme.spacing.unit,
    borderRadius: 10,
    marginRight: theme.spacing.unit * 2,
    backgroundColor: theme.circleIn.palette.appBar
  },
  icon: {
    marginRight: theme.spacing.unit
  },
  button: {
    height: 40,
    backgroundColor: theme.circleIn.palette.success
  }
});

type Props = {
  classes: Object,
  title?: string,
  text?: string,
  imageUrl?: string,
  referralCode?: string,
  onCopy?: Function
};

type State = {};

class InviteYourFriendsCard extends React.PureComponent<Props, State> {
  static defaultProps = {
    title: 'Invite Your Friends',
    text:
      'Get 5 classmates to sign up on CircleIn using your referral code and you’ll earn a $10 Starbucks Giftcard!',
    imageUrl:
      'https://media.circleinapp.com/reward_images/starbucks-store-logo.png',
    referralCode: '',
    onCopy: () => {}
  };

  state = {};

  render() {
    const { classes, title, text, imageUrl, referralCode, onCopy } = this.props;

    return (
      <Paper className={classes.root} elevation={1}>
        <Typography variant="h5" paragraph>
          {title}
        </Typography>
        <Typography variant="h6" align="left">
          {text}
        </Typography>
        <div className={classes.referral}>
          <img alt={title} src={imageUrl} className={classes.img} />
          <div className={classes.link}>
            <Typography variant="h6" align="center">
              {referralCode}
            </Typography>
          </div>
          <CopyToClipboard text={referralCode} onCopy={onCopy}>
            <Button
              variant="contained"
              color="primary"
              autoFocus
              className={classes.button}
            >
              Share
            </Button>
          </CopyToClipboard>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(InviteYourFriendsCard);
