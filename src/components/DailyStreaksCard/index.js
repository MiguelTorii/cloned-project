// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

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
  }
});

type Props = {
  classes: Object,
  progress?: number,
  day?: string,
  points?: number,
  pointsTomorrow?: number
};

type State = {};

class DailyStreaksCard extends React.PureComponent<Props, State> {
  static defaultProps = {
    progress: 0,
    day: 'Day 1',
    points: 0,
    pointsTomorrow: 0
  };

  state = {};

  render() {
    const { classes, progress, day, points, pointsTomorrow } = this.props;

    return (
      <Paper className={classes.root} elevation={1}>
        <Typography variant="h4" paragraph>
          Daily Streaks
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
              value={progress}
              size={size}
              thickness={thickness}
            />
          </div>
          <div className={classes.progress}>
            <Typography variant="h6" className={classes.dayText} align="center">
              {day}
            </Typography>
            <Typography variant="subtitle1" align="center">
              {`+${points || 0} SP`}
            </Typography>
          </div>
        </div>
        <Typography variant="h6" align="center">
          {`Tomorrow: Earn ${pointsTomorrow || 0} SP!`}
        </Typography>
      </Paper>
    );
  }
}

export default withStyles(styles)(DailyStreaksCard);
