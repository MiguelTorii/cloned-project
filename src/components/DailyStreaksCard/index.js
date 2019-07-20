// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    margin: theme.spacing.unit,
    marginBottom: 0
  },
  progress: {}
});

type Props = {
  classes: Object
};

type State = {};

class DailyStreaksCard extends React.PureComponent<Props, State> {
  state = {};

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root} elevation={1}>
        <Typography variant="h4" paragraph>
          Daily streaks
        </Typography>
        <CircularProgress
          className={classes.progress}
          variant="static"
          value={50}
          size={60}
          thickness={10}
        />
      </Paper>
    );
  }
}

export default withStyles(styles)(DailyStreaksCard);
