// @flow

import React from 'react';
import update from 'immutability-helper';
import debounce from 'lodash/debounce';
import { connect } from 'react-redux';
import ReactCardFlip from 'react-card-flip';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as notificationsActions from 'actions/notifications';
import { bindActionCreators } from 'redux';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import type { ToDos } from '../../types/models';
import RemidersList from '../../components/RemindersList';
import RemindersCalendar from '../../components/RemindersCalendar';
import {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder
} from '../../api/reminders';
import ErrorBoundary from '../ErrorBoundary';

const styles = theme => ({
  stackbar: {
    backgroundColor: theme.circleIn.palette.snackbar,
    color: theme.circleIn.palette.primaryText1
  },
});

type Props = {
  classes: Object,
  enqueueSnackbar: Function,
  user: UserState
};

type State = {
  reminders: ToDos,
  list: boolean,
  loading: boolean
};

class Reminders extends React.PureComponent<Props, State> {
  state = {
    reminders: [],
    list: true,
    loading: false
  };

  componentDidMount = () => {
    this.handleFetchReminders = debounce(this.handleFetchReminders, 500);
    this.handleUpdateDB = debounce(this.handleUpdateDB, 500);
    this.handleFetchReminders();
  };

  componentWillUnmount = () => {
    if (
      this.handleFetchReminders.cancel &&
      typeof this.handleFetchReminders.cancel === 'function'
    )
      this.handleFetchReminders.cancel();
    if (
      this.handleUpdateDB.cancel &&
      typeof this.handleUpdateDB.cancel === 'function'
    )
      this.handleUpdateDB.cancel();
  };

  handlePoints = res => {
    try {
      const {
        points,
        user: {
          first_name: firstName
        }
      } = res
      const { enqueueSnackbar, classes } = this.props;
      if (points) {
        enqueueSnackbar({
          notification: {
            message: `Congratulations ${firstName}, you have just earned ${points} points. Good Work!`,
            options: {
              variant: 'success',
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left'
              },
              autoHideDuration: 7000,
              ContentProps: {
                classes: {
                  root: classes.stackbar
                }
              }
            }
          }
        });
      }
    } catch(e) {}
  }

  handleFetchReminders = async () => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;
    if (userId !== '') {
      const reminders = await getReminders({ userId });
      this.setState({ reminders });
    } else {
      this.handleFetchReminders();
    }
  };

  handleUpdate = ({ id, status }) => () => {
    const newState = update(this.state, {
      reminders: {
        $apply: b => {
          const index = b.findIndex(item => item.id === id);
          if (index > -1) {
            return update(b, {
              [index]: {
                status: { $set: status }
              }
            });
          }
          return b;
        }
      }
    });

    this.setState(newState);
    this.handleUpdateDB({ id, status });
  };

  handleUpdateDB = async ({ id, status }) => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;
    const res = await updateReminder({ userId, id, status });
    this.handlePoints(res)
  };

  handleDelete = id => () => {
    const newState = update(this.state, {
      reminders: {
        $apply: b => {
          const index = b.findIndex(item => item.id === id);
          if (index > -1) {
            return update(b, { $splice: [[index, 1]] });
          }
          return b;
        }
      }
    });

    this.setState(newState);
    const {
      user: {
        data: { userId }
      }
    } = this.props;
    deleteReminder({ userId, id });
  };

  handleSwitch = () => {
    this.setState(({ list }) => ({ list: !list }));
  };

  handleSubmit = async ({
    title,
    dueDate,
    label
  }: {
    title: string,
    dueDate: number,
    label: number
  }) => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;
    this.setState({ loading: true });
    try {
      const res = await createReminder({ userId, title, label, dueDate });
      this.handlePoints(res)
      await this.handleFetchReminders();
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const {
      classes,
      user: {
        isLoading,
        error,
        data: { userId }
      }
    } = this.props;
    const { list, loading, reminders } = this.state;

    if (isLoading) return <CircularProgress size={12} />;
    if (userId === '' || error)
      return 'Oops, there was an error loading your data, please try again.';

    return (
      <div className={classes.root}>
        <ReactCardFlip isFlipped={!list}>
          <ErrorBoundary key="front">
            <RemidersList
              loading={loading}
              reminders={reminders}
              onSwitch={this.handleSwitch}
              onSubmit={this.handleSubmit}
              onUpdate={this.handleUpdate}
              onDelete={this.handleDelete}
            />
          </ErrorBoundary>
          <ErrorBoundary key="back">
            <RemindersCalendar
              loading={loading}
              reminders={reminders}
              onSwitch={this.handleSwitch}
              onSubmit={this.handleSubmit}
              onUpdate={this.handleUpdate}
              onDelete={this.handleDelete}
            />
          </ErrorBoundary>
        </ReactCardFlip>
      </div>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      enqueueSnackbar: notificationsActions.enqueueSnackbar
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Reminders));
