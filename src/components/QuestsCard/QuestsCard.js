// @flow
import React from 'react';
// import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
// import Link from '@material-ui/core/Link';
import CircularProgress from '@material-ui/core/CircularProgress';
import Quests from './Quests';
import type { QuestsCard as QuestsCardState } from '../../types/models';
import { renderText } from '../HomeGridList/utils';
import { styles } from '../_styles/QuestsCard/index';

// const MyLink = ({ href, ...props }) => <RouterLink to={href} {...props} />;

type Props = {
  classes: Object,
  userId: string,
  data: QuestsCardState,
  isLoading: boolean
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
        <div className={classes.status}>
          <Typography variant="subtitle1" align="center">
            {renderText(
              data.availablePointsText.text,
              data.availablePointsText.style
            )}
          </Typography>
          <Typography variant="subtitle1" align="center">
            {renderText(data.progressText.text, data.progressText.style)}
          </Typography>
        </div>
        {/* <div className={classes.links}>
          <Typography variant="h6">
            <Link
              href="/"
              component={MyLink}
              color="inherit"
              className={classes.link}
            >
              Clear All Completed
            </Link>
          </Typography>
        </div> */}
      </Paper>
    );
  }
}

export default withStyles(styles)(QuestsCard);
