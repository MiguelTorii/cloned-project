// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: 'white',
    marginBottom: theme.spacing.unit * 2
  }
});

type Props = {
  classes: Object
};

type State = {};

class NoParticipants extends React.PureComponent<Props, State> {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Typography variant="h5" className={classes.text}>
          Waiting for others to Join
        </Typography>
        <CircularProgress />
      </div>
    );
  }
}

export default withStyles(styles)(NoParticipants);
