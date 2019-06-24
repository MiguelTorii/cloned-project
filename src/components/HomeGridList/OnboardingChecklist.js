// @flow
import React from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import type { HomeCard } from '../../types/models';
import { renderText } from './utils';

const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  title: {
    fontWeight: 'bold'
  },
  quests: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  quest: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: theme.spacing.unit * 2
  },
  item: {
    textDecoration: 'line-through'
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    marginRight: theme.spacing.unit,
    width: 15,
    height: 15,
    fontSize: 10
  },
  progress: {
    marginTop: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  divider: {
    minWidth: 200,
    margin: theme.spacing.unit
  }
});

type Props = {
  classes: Object,
  card: HomeCard
};

type State = {};

class OnboardingChecklist extends React.PureComponent<Props, State> {
  render() {
    const { classes, card } = this.props;
    const {
      title,
      data: {
        message: { text, style },
        quests,
        progressMessage: { text: progressText, style: progressStyle }
      }
    } = card;

    return (
      <Grid item xs={12}>
        <Paper className={classes.paper} elevation={0}>
          <Typography variant="h4" className={classes.title} paragraph>
            {title}
          </Typography>
          <Typography variant="subtitle1">{renderText(text, style)}</Typography>
          <div className={classes.quests}>
            {quests.map((quest, index) => (
              <div key={quest.item} className={classes.quest}>
                <Avatar className={classes.avatar}>{index + 1}</Avatar>
                <Typography
                  variant="subtitle2"
                  color="primary"
                  className={cx(quest.status === 'complete' && classes.item)}
                >
                  {quest.item}
                </Typography>
              </div>
            ))}
          </div>
          <div className={classes.progress}>
            <Divider className={classes.divider} light />
            <Typography variant="subtitle1">
              {renderText(progressText, progressStyle)}
            </Typography>
          </div>
        </Paper>
      </Grid>
    );
  }
}

export default withStyles(styles)(OnboardingChecklist);