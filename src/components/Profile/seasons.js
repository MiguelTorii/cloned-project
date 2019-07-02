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
    // maxWidth: 600,
    marginBottom: theme.spacing.unit * 2
  },
  gridContainer: {
    marginBottom: theme.spacing.unit * 2,
    height: '100%'
  },
  rankContainer: {
    width: '100%',
    marginBottom: theme.spacing.unit * 2,
    height: '100%',
    minHeight: 146,
    [theme.breakpoints.down('xs')]: {
      minHeight: 300
    }
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
  classes: Object,
  seasons: Array<Object>
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
    const { classes, seasons } = this.props;
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
              {seasons.map(item => (
                <Tab key={item.seasonId} label={item.name} />
              ))}
            </Tabs>
          </div>
          <Grid
            container
            justify="space-evenly"
            spacing={16}
            className={classes.gridContainer}
            item
            xs={12}
            sm={8}
          >
            <Grid item className={classes.data}>
              <Typography variant="h3" gutterBottom>
                {seasons[value].thanks.toLocaleString()}
              </Typography>
              <Typography variant="h6">Thanks Received</Typography>
            </Grid>
            <Grid item className={classes.data}>
              <Typography variant="h3" gutterBottom>
                {seasons[value].points.toLocaleString()}
              </Typography>
              <Typography variant="h6">Points</Typography>
            </Grid>
            <Grid item className={classes.data}>
              <Typography variant="h3" gutterBottom>
                {seasons[value].communityServiceHours.toLocaleString()}
              </Typography>
              <Typography variant="h6">Community Service Hours</Typography>
            </Grid>
            <Grid item className={classes.data}>
              <Typography variant="h3" gutterBottom>
                {seasons[value].bestAnswers.toLocaleString()}
              </Typography>
              <Typography variant="h6">Best Answers</Typography>
            </Grid>
            <Grid item className={classes.data}>
              <Typography variant="h3" gutterBottom>
                {seasons[value].reach.toLocaleString()}
              </Typography>
              <Typography variant="h6">Reach</Typography>
            </Grid>
          </Grid>
          <Grid
            container
            justify="space-evenly"
            alignItems="stretch"
            spacing={16}
            className={classes.rankContainer}
            item
            xs={12}
            sm={8}
          >
            <Grid item className={classes.badgeGridItem}>
              <div className={classes.badgeWrapper}>
                <img
                  alt="Bronze"
                  src={bronze}
                  className={cx(
                    classes.badge,
                    seasons[value].rankReached - 1 === 0 &&
                      classes.badgeSelected
                  )}
                />
              </div>
              <Typography variant="h6">Bronze</Typography>
            </Grid>
            <Grid item className={classes.badgeGridItem}>
              <div className={classes.badgeWrapper}>
                <img
                  alt="Silver"
                  src={silver}
                  className={cx(
                    classes.badge,
                    seasons[value].rankReached - 1 === 1 &&
                      classes.badgeSelected
                  )}
                />
              </div>
              <Typography variant="h6">Silver</Typography>
            </Grid>
            <Grid item className={classes.badgeGridItem}>
              <div className={classes.badgeWrapper}>
                <img
                  alt="Gold"
                  src={gold}
                  className={cx(
                    classes.badge,
                    seasons[value].rankReached - 1 === 2 &&
                      classes.badgeSelected
                  )}
                />
              </div>
              <Typography variant="h6">Gold</Typography>
            </Grid>
            <Grid item className={classes.badgeGridItem}>
              <div className={classes.badgeWrapper}>
                <img
                  alt="Platinum"
                  src={platinum}
                  className={cx(
                    classes.badge,
                    seasons[value].rankReached - 1 === 3 &&
                      classes.badgeSelected
                  )}
                />
              </div>
              <Typography variant="h6">Platinum</Typography>
            </Grid>
            <Grid item className={classes.badgeGridItem}>
              <div className={classes.badgeWrapper}>
                <img
                  alt="Diamond"
                  src={diamond}
                  className={cx(
                    classes.badge,
                    seasons[value].rankReached - 1 === 4 &&
                      classes.badgeSelected
                  )}
                />
              </div>
              <Typography variant="h6">Diamond</Typography>
            </Grid>
            <Grid item className={classes.badgeGridItem}>
              <div className={classes.badgeWrapper}>
                <img
                  alt="Master"
                  src={master}
                  className={cx(
                    classes.badge,
                    seasons[value].rankReached - 1 === 5 &&
                      classes.badgeSelected
                  )}
                />
              </div>
              <Typography variant="h6">Master</Typography>
            </Grid>
          </Grid>
          <Grid container item xs={12} sm={8}>
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
