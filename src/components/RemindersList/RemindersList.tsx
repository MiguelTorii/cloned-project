import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import type { ToDo } from '../../types/models';
import RemindersAddNew from '../RemindersAddNew/RemindersAddNew';
import RemidersListItem from './RenderListItem';
import * as utils from './utils';
import { styles } from '../_styles/RemindersList/index';

type Props = {
  classes?: Record<string, any>;
  reminders?: ToDo[];
  loading?: boolean;
  onSwitch?: Function;
  onSubmit?: (...args: Array<any>) => any;
  onUpdate?: (...args: Array<any>) => any;
  onDelete?: (...args: Array<any>) => any;
};
type State = {};

class RemindersList extends React.PureComponent<Props, State> {
  render() {
    const { classes, reminders, loading, onSwitch, onSubmit, onUpdate, onDelete } = this.props;
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
        <Paper elevation={2} className={classes.paper}>
          <div className={classes.header}>
            <Typography component="h1" variant="h5">
              Reminders
            </Typography>
          </div>
          <div className={classes.content}>
            <RemindersAddNew loading={loading} onSubmit={onSubmit} />
            <Paper className={classes.listPaper} elevation={3}>
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

export default withStyles(styles as any)(RemindersList);
