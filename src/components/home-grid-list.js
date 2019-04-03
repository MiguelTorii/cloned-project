// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    maxHeight: 'inherit',
    display: 'flex',
    padding: theme.spacing.unit
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    textAlign: 'center'
  },
  logos: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.unit,
    '& > :first-child': {
      margin: theme.spacing.unit
    },
    '& > :last-child': {
      margin: theme.spacing.unit
    }
  },
  topPost: {
    display: 'flex',
    padding: theme.spacing.unit,
    alignItems: 'center',
    '& > :first-child': {
      marginRight: theme.spacing.unit
    }
  },
  feedCTA: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
});

type Props = {
  classes: Object
};

type State = {};

class FeedItem extends React.PureComponent<Props, State> {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container className={classes.root} spacing={16}>
          <Grid item xs={12}>
            <Paper className={classes.paper} elevation={0}>
              <Typography variant="h6" component="h3">
                Top Posts
              </Typography>
              <div className={classes.topPost}>
                <Avatar className={classes.avatar}>JW</Avatar>
                <Typography variant="body1" component="h3">
                  Does anyone understand practice question #4 by{' '}
                  <Link href="https://google.com">Josh Wright</Link> Math102
                </Typography>
              </div>
              <div className={classes.topPost}>
                <Avatar className={classes.avatar}>SR</Avatar>
                <Typography variant="body1" component="h3">
                  Test #2 Study Guide by{' '}
                  <Link href="https://google.com">Steve Ross</Link> HIST120
                </Typography>
              </div>
              <div className={classes.topPost}>
                <Avatar className={classes.avatar}>SY</Avatar>
                <Typography variant="body1" component="h3">
                  Section 2.8 Practice Quiz by{' '}
                  <Link href="https://google.com">Sarah Yu</Link> MATH102
                </Typography>
              </div>
              <div className={classes.feedCTA}>
                <Button variant="contained" color="primary">
                  Go to your feed
                </Button>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper} elevation={0}>
              <Typography variant="h6" component="h3" paragraph>
                Season 3 Grand Prize
              </Typography>
              <Typography variant="subtitle2" component="h3">
                $250 Shopping Spree to
              </Typography>
              <div className={classes.logos}>
                <img
                  src="https://logosmarcas.com/wp-content/uploads/2018/05/Amazon-Logo.png"
                  alt="Amazon"
                  style={{ width: 100 }}
                />
                <img
                  src="http://www.seeklogovector.com/wp-content/uploads/2018/06/nordstrom-logo-vector.png"
                  alt="Nordstrom"
                  style={{ width: 100 }}
                />
              </div>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper} elevation={0}>
              <Typography variant="h6" component="h3" paragraph>
                Study Circle
              </Typography>
              <Typography variant="subtitle1" component="h3" paragraph>
                Add your first classmate to your Study Circle to receive
                notifications when they post new content.
              </Typography>
              <Typography variant="subtitle2">
                <Link href="https://google.com" className={classes.link}>
                  What are Study Circles?
                </Link>
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper} elevation={0}>
              <Typography variant="h6" component="h3">
                Overall Stats
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper} elevation={0}>
              <Typography variant="h6" component="h3">
                Leaderboard
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(FeedItem);
