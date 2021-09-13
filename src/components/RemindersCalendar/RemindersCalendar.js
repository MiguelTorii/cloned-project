// @flow

import React, { Fragment } from 'react';
import cx from 'classnames';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import LabelIcon from '@material-ui/icons/Label';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import type { ToDos } from '../../types/models';
import RemindersAddNew from '../RemindersAddNew/RemindersAddNew';
import Dialog from '../Dialog/Dialog';
import Toolbar from './Toolbar';
import DateHeader from './DateHeader';
import MonthHeader from './MonthHeader';
import Event from './Event';
import * as utils from './utils';
import { styles } from '../_styles/RemindersCalendar/index';

const localizer = BigCalendar.momentLocalizer(moment);

type Props = {
  classes: Object,
  loading: boolean,
  reminders: ToDos,
  onSwitch: Function,
  onSubmit: Function,
  onUpdate: Function,
  onDelete: Function
};

type State = {
  id: number,
  title: string,
  due: string,
  label: number,
  status: number
};

class RemindersCalendar extends React.PureComponent<Props, State> {
  state = {
    id: -1,
    title: '',
    due: '',
    label: -2,
    status: -1
  };

  handleSelectEvent = (event) => {
    const { id = -1, title = '', due = '', label = -2, status = -1 } = event;
    this.setState({ id, title, due, label, status });
  };

  handleClose = () => {
    this.setState({ id: -1, title: '', due: '', label: -2, status: -1 });
  };

  handleUpdate =
    ({ id, status }) =>
    () => {
      const { onUpdate } = this.props;
      this.handleClose();
      onUpdate({ id, status })();
    };

  handleDelete = (id) => () => {
    const { onDelete } = this.props;
    this.handleClose();
    onDelete(id)();
  };

  renderClass = (label) => {
    const { classes } = this.props;
    switch (label) {
      case 1:
        return classes.green;
      case 2:
        return classes.blue;
      case 3:
        return classes.grey;
      default:
        return classes.red;
    }
  };

  render() {
    const { classes, reminders, loading, onSwitch, onSubmit } = this.props;
    const { id, title, due, label, status } = this.state;
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
      <Fragment>
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
                    onSelectEvent={this.handleSelectEvent}
                  />
                </div>
              </Paper>
            </div>
          </Paper>
        </main>
        <Dialog
          open={
            id !== -1 &&
            title !== '' &&
            due !== '' &&
            label !== -2 &&
            status !== -1
          }
          okTitle="OK"
          onCancel={this.handleClose}
          onOk={this.handleClose}
          showActions
          title="View Event"
        >
          <List component="div" disablePadding>
            <ListItem
              button
              dense
              key={id}
              onClick={this.handleUpdate({
                id,
                status: status === 2 ? 1 : 2
              })}
            >
              <ListItemIcon>
                <Checkbox checked={status === 2} tabIndex={-1} disableRipple />
              </ListItemIcon>
              <ListItemIcon>
                <LabelIcon className={cx(this.renderClass(label))} />
              </ListItemIcon>
              <ListItemText
                inset
                primary={title}
                secondary={due}
                secondaryTypographyProps={{ color: 'textPrimary' }}
              />
              <ListItemSecondaryAction>
                <IconButton aria-label="Delete" onClick={this.handleDelete(id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Dialog>
      </Fragment>
    );
  }
}

export default withStyles(styles)(RemindersCalendar);
