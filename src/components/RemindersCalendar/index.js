// @flow

import React, { Fragment } from 'react';
import cx from 'classnames';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import DeleteIcon from '@material-ui/icons/Delete';
import LabelIcon from '@material-ui/icons/Label';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import type { ToDos } from '../../types/models';
import RemindersAddNew from '../RemindersAddNew';
import DialogTitle from '../DialogTitle';
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
    height: 520,
    marginTop: theme.spacing.unit * 2,
    backgroundColor: theme.circleIn.palette.appBar
  },
  calendar: {
    width: '100%',
    maxWidth: 600,
    height: 400
  },
  red: {
    color: red[500]
  },
  blue: {
    color: blue[500]
  },
  green: {
    color: green[500]
  },
  grey: {
    color: grey[500]
  }
});

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

  handleSelectEvent = event => {
    const { id = -1, title = '', due = '', label = -2, status = -1 } = event;
    this.setState({ id, title, due, label, status });
  };

  handleClose = () => {
    this.setState({ id: -1, title: '', due: '', label: -2, status: -1 });
  };

  handleUpdate = ({ id, status }) => () => {
    const { onUpdate } = this.props;
    this.handleClose();
    onUpdate({ id, status })();
  };

  handleDelete = id => () => {
    const { onDelete } = this.props;
    this.handleClose();
    onDelete(id)();
  };

  renderClass = label => {
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
          fullWidth
          onClose={this.handleClose}
          aria-labelledby="reminders-dialog-title"
          aria-describedby="reminders-dialog-description"
        >
          <DialogTitle
            variant="h5"
            id="reminders-dialog-title"
            onClose={this.handleClose}
          >
            View Event
          </DialogTitle>
          <DialogContent>
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
                  <Checkbox
                    checked={status === 2}
                    tabIndex={-1}
                    disableRipple
                  />
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
                  <IconButton
                    aria-label="Delete"
                    onClick={this.handleDelete(id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

export default withStyles(styles)(RemindersCalendar);
