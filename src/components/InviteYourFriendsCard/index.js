// @flow
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { InviteCard } from '../../types/models';
import { renderText } from '../HomeGridList/utils';

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
  },
  progress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing.unit * 2
  }
});

type Props = {
  classes: Object,
  data: InviteCard,
  isLoading: boolean,
  onCopy: Function
};

type State = {};

class InviteYourFriendsCard extends React.PureComponent<Props, State> {
  state = {};

  render() {
    const { classes, data, onCopy, isLoading } = this.props;

    if (isLoading)
      return (
        <Paper className={classes.root} elevation={1}>
          <div className={classes.progress}>
            <CircularProgress />
          </div>
        </Paper>
      );

    return (
      <Paper className={classes.root} elevation={1}>
        <Typography variant="h4" paragraph>
          {data.title}
        </Typography>
        <Typography variant="h6" align="left">
          {renderText(data.subtitle.text, data.subtitle.style)}
        </Typography>
        <div className={classes.referral}>
          <img alt={data.title} src={data.imageUrl} className={classes.img} />
          <div className={classes.link}>
            <Typography variant="h6" align="center">
              {data.referralCode}
            </Typography>
          </div>
          <CopyToClipboard text={data.referralCode} onCopy={onCopy}>
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
