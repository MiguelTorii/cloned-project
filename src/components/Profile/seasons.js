// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

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
    flex: 1
  }
});

type Props = {
  classes: Object
};

class Seasons extends React.PureComponent<Props> {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <Paper className={classes.root} elevation={0}>
          <Typography variant="h6" gutterBottom>
            Seasons
          </Typography>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(Seasons);
