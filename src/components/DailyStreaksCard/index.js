// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { DailyStreaksCard as StreaksCard } from '../../types/models';

const size = 150;
const thickness = 10;

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    height: '100%'
  },
  progressWrapper: {
    position: 'relative',
    width: '100%',
    minHeight: 170
  },
  progress: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  main: {
    color: theme.circleIn.palette.success
  },
  background: {
    color: theme.circleIn.palette.disabled
  },
  dayText: {
    color: '#fec04f',
    fontWeight: 'bold'
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing.unit * 2
  }
});

type Props = {
  classes: Object,
  data: StreaksCard,
  isLoading: boolean
};

type State = {};

class DailyStreaksCard extends React.PureComponent<Props, State> {
  state = {};

  render() {
    const { classes, data, isLoading } = this.props;

    if (isLoading)
      return (
        <Paper className={classes.root} elevation={1}>
          <div className={classes.loading}>
            <CircularProgress />
          </div>
        </Paper>
      );

    return (
      <Paper className={classes.root} elevation={1}>
        <Typography variant="h4" paragraph>
          {data.title}
        </Typography>
        <div className={classes.progressWrapper}>
          <div className={classes.progress}>
            <CircularProgress
              className={classes.background}
              variant="static"
              value={100}
              size={size}
              thickness={thickness}
            />
          </div>
          <div className={classes.progress}>
            <CircularProgress
              className={classes.main}
              variant="static"
              value={(data.currentDay * 100) / 5}
              size={size}
              thickness={thickness}
            />
          </div>
          <div className={classes.progress}>
            <Typography variant="h5" className={classes.dayText} align="center">
              {`Day ${data.currentDay}`}
            </Typography>
            <Typography variant="h6" align="center">
              {`+${(data.tiers.find(o => o.day === data.currentDay) || {})
                .points || 0} SP`}
            </Typography>
          </div>
        </div>
        <Typography variant="h5" align="center">
          {`Tomorrow: Earn ${(
            data.tiers.find(o => o.day === data.currentDay + 1) || {}
          ).points || 0} SP!`}
        </Typography>
      </Paper>
    );
  }
}

export default withStyles(styles)(DailyStreaksCard);
