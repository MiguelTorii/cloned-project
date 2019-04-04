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
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 4,
    flex: 1
  },
  content: {
    marginLeft: theme.spacing.unit * 4
  }
});

type Props = {
  classes: Object
};

class About extends React.PureComponent<Props> {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <Paper className={classes.root} elevation={0}>
          <div className={classes.content}>
            <Typography variant="h4" gutterBottom>
              About Me
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Do you prefer to study in person or video meet up?
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Do you prefer to study in groups or individually?
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Do you like helping others with homework study help, if so, which
              subjects?
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Are you in any clubs or organizations on campus?
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Major
            </Typography>
          </div>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(About);
