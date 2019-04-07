// @flow
import React from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import bronze from '../../assets/svg/rank_bronze.svg';
import silver from '../../assets/svg/rank_silver.svg';
import gold from '../../assets/svg/rank_gold.svg';
import platinum from '../../assets/svg/rank_platinum.svg';
import diamond from '../../assets/svg/rank_diamond.svg';
import master from '../../assets/svg/rank_master.svg';

const styles = theme => ({
  container: {
    maxHeight: 'inherit',
    display: 'flex',
    padding: theme.spacing.unit
  },
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabs: {
    maxWidth: 600,
    marginBottom: theme.spacing.unit * 2
  },
  gridContainer: {
    marginBottom: theme.spacing.unit * 2
  },
  data: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeGridItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing.unit * 2
  },
  badge: {
    height: 40,
    width: 40
  },
  badgeSelected: {
    height: 100,
    width: 100
  },
  progress: {
    width: '100%',
    height: 20,
    borderRadius: 10,
    marginBottom: theme.spacing.unit * 2
  }
});

type Props = {
  classes: Object
};

type State = {
  value: number
};

class Seasons extends React.PureComponent<Props, State> {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    return (
      <div className={classes.container}>
        <Paper className={classes.root} elevation={0}>
          <div className={classes.tabs}>
            <Tabs
              value={value}
              onChange={this.handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Season 1" />
              <Tab label="Season 2" />
              <Tab label="Season 3" />
              <Tab label="All" />
            </Tabs>
          </div>
          <Grid
            container
            justify="center"
            spacing={16}
            className={classes.gridContainer}
          >
            <Grid item className={classes.data}>
              <Typography variant="h3" gutterBottom>
                10
              </Typography>
              <Typography variant="body2">Thanks Received</Typography>
            </Grid>
            <Grid item className={classes.data}>
              <Typography variant="h3" gutterBottom>
                10,000
              </Typography>
              <Typography variant="body2">Points</Typography>
            </Grid>
            <Grid item className={classes.data}>
              <Typography variant="h3" gutterBottom>
                36
              </Typography>
              <Typography variant="body2">Community Service Hours</Typography>
            </Grid>
            <Grid item className={classes.data}>
              <Typography variant="h3" gutterBottom>
                5
              </Typography>
              <Typography variant="body2">Best Answers</Typography>
            </Grid>
            <Grid item className={classes.data}>
              <Typography variant="h3" gutterBottom>
                5
              </Typography>
              <Typography variant="body2">Reach</Typography>
            </Grid>
          </Grid>
          <Grid
            container
            justify="center"
            alignItems="stretch"
            spacing={16}
            className={classes.gridContainer}
          >
            <Grid item className={classes.badgeGridItem}>
              <div className={classes.badgeWrapper}>
                <img alt="Bronze" src={bronze} className={classes.badge} />
              </div>
              <Typography variant="caption">Bronze</Typography>
            </Grid>
            <Grid item className={classes.badgeGridItem}>
              <div className={classes.badgeWrapper}>
                <img alt="Silver" src={silver} className={classes.badge} />
              </div>
              <Typography variant="caption">Silver</Typography>
            </Grid>
            <Grid item className={classes.badgeGridItem}>
              <div className={classes.badgeWrapper}>
                <img alt="Gold" src={gold} className={classes.badge} />
              </div>
              <Typography variant="caption">Gold</Typography>
            </Grid>
            <Grid item className={classes.badgeGridItem}>
              <div className={classes.badgeWrapper}>
                <img
                  alt="Platinum"
                  src={platinum}
                  className={cx(classes.badge, classes.badgeSelected)}
                />
              </div>
              <Typography variant="body1">Platinum</Typography>
            </Grid>
            <Grid item className={classes.badgeGridItem}>
              <div className={classes.badgeWrapper}>
                <img alt="Diamond" src={diamond} className={classes.badge} />
              </div>
              <Typography variant="caption">Diamond</Typography>
            </Grid>
            <Grid item className={classes.badgeGridItem}>
              <div className={classes.badgeWrapper}>
                <img alt="Master" src={master} className={classes.badge} />
              </div>
              <Typography variant="caption">Master</Typography>
            </Grid>
          </Grid>
          <Grid container item xs={6}>
            <LinearProgress
              variant="determinate"
              value={30}
              className={classes.progress}
            />
          </Grid>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(Seasons);
