import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Quests from './Quests';
import type { QuestsCard as QuestsCardState } from '../../types/models';
import { styles } from '../_styles/QuestsCard/index';

type Props = {
  classes: Record<string, any>;
  userId: string;
  data: QuestsCardState;
  isLoading: boolean;
};
type State = {};

class QuestsCard extends React.PureComponent<Props, State> {
  state = {};

  render() {
    const { classes, userId, data, isLoading } = this.props;

    if (isLoading) {
      return (
        <Paper className={classes.root} elevation={1}>
          <div className={classes.progress}>
            <CircularProgress />
          </div>
        </Paper>
      );
    }

    return (
      <Paper className={classes.root} elevation={1}>
        <Typography variant="h4" paragraph>
          Quests
        </Typography>
        <Quests userId={userId} quests={data.activeQuests} />
        <div className={classes.status} />
      </Paper>
    );
  }
}

export default withStyles(styles as any)(QuestsCard);
