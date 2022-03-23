import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { styles } from '../_styles/MeetUp/NoParticipants';

type Props = {
  classes: Record<string, any>;
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

export default withStyles(styles as any)(NoParticipants);
