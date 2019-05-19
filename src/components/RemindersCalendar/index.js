// @flow

import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import type { ToDos } from '../../types/models';
import RemindersAddNew from '../RemindersAddNew';
import Toolbar from './Toolbar';
import DateHeader from './DateHeader';
import MonthHeader from './MonthHeader';
import Event from './Event';
import * as utils from './utils';

const localizer = BigCalendar.momentLocalizer(moment);

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
  calendarPaper: {
    padding: theme.spacing.unit * 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: theme.spacing.unit * 2,
    backgroundColor: theme.circleIn.palette.appBar
  },
  calendar: {
    width: '100%',
    maxWidth: 600,
    height: 400
  }
});

type Props = {
  classes: Object,
  loading: boolean,
  reminders: ToDos,
  onSwitch: Function,
  onSubmit: Function
};

type State = {};

class RemindersCalendar extends React.PureComponent<Props, State> {
  render() {
    const { classes, reminders, loading, onSwitch, onSubmit } = this.props;
    const events = utils.getEvents(reminders);
    const components = {
      toolbar: Toolbar,
      event: Event,
      month: {
        dateHeader: DateHeader,
        header: MonthHeader
      }
    };

    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <div className={classes.header}>
            <Typography component="h1" variant="h5">
              Reminders - Calendar
            </Typography>
            <Button
              color="primary"
              className={classes.marginLeft}
              onClick={onSwitch}
            >
              Switch to List View
            </Button>
          </div>
          <div className={classes.content}>
            <RemindersAddNew loading={loading} onSubmit={onSubmit} />
            <Paper className={classes.calendarPaper} elevation={1}>
              <div className={classes.calendar}>
                <BigCalendar
                  localizer={localizer}
                  events={events}
                  views={{
                    month: true
                    // agenda: AgendaDate
                  }}
                  startAccessor="start"
                  endAccessor="end"
                  components={components}
                />
              </div>
            </Paper>
          </div>
        </Paper>
      </main>
    );
  }
}

export default withStyles(styles)(RemindersCalendar);
