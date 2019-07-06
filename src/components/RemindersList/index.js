// @flow

import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
// import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import type { ToDos } from '../../types/models';
import RemindersAddNew from '../RemindersAddNew';
import RemidersListItem from './RenderListItem';
import * as utils from './utils';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3
  },
  paper: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 8,
    minHeight: 400,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  header: {
    display: 'flex',
    alignItems: 'center'
  },
  marginLeft: {
    marginLeft: theme.spacing.unit * 2
  },
  content: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column'
  },
  listPaper: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    minHeight: 48,
    marginTop: theme.spacing.unit * 2,
    backgroundColor: theme.circleIn.palette.appBar
  },
  list: {
    width: '100%'
  }
});

type Props = {
  classes: Object,
  reminders: ToDos,
  loading: boolean,
  // onSwitch: Function,
  onSubmit: Function,
  onUpdate: Function,
  onDelete: Function
};

type State = {};

class RemindersList extends React.PureComponent<Props, State> {
  render() {
    const {
      classes,
      reminders,
      loading,
      // onSwitch,
      onSubmit,
      onUpdate,
      onDelete
    } = this.props;

    const overdueItems = utils.getOverdue(reminders) || [];
    const overdueLeft = utils.getLeftCount(overdueItems) || 0;
    const todayItems = utils.getToday(reminders) || [];
    const todayLeft = utils.getLeftCount(todayItems) || 0;
    const tomorrowItems = utils.getTomorrow(reminders) || [];
    const tomorrowLeft = utils.getLeftCount(tomorrowItems) || 0;
    const upcomingItems = utils.getUpcoming(reminders) || [];
    const upcomingLeft = utils.getLeftCount(upcomingItems) || 0;

    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <div className={classes.header}>
            <Typography component="h1" variant="h5">
              Reminders - List
            </Typography>
            {/* <Button
              color="primary"
              className={classes.marginLeft}
              onClick={onSwitch}
            >
              Switch to Calendar View
            </Button> */}
          </div>
          <div className={classes.content}>
            <RemindersAddNew loading={loading} onSubmit={onSubmit} />
            <Paper className={classes.listPaper} elevation={1}>
              <List component="nav" className={classes.list}>
                <RemidersListItem
                  items={overdueItems}
                  title="Overdue"
                  left={overdueLeft}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
                <RemidersListItem
                  items={todayItems}
                  title="Today"
                  left={todayLeft}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
                <RemidersListItem
                  items={tomorrowItems}
                  title="Tomorrow"
                  left={tomorrowLeft}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
                <RemidersListItem
                  items={upcomingItems}
                  title="Upcoming"
                  left={upcomingLeft}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              </List>
            </Paper>
          </div>
        </Paper>
      </main>
    );
  }
}

export default withStyles(styles)(RemindersList);
