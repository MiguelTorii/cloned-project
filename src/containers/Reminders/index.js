// @flow

import React from 'react';
import update from 'immutability-helper';
import debounce from 'lodash/debounce';
import { connect } from 'react-redux';
import ReactCardFlip from 'react-card-flip';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
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
import { logEvent } from '../../api/analytics';
import ErrorBoundary from '../ErrorBoundary';

const styles = () => ({});

type Props = {
  classes: Object,
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
    list: false,
    loading: false
  };

  componentDidMount = () => {
    this.handleFetchReminders = debounce(this.handleFetchReminders, 500);
    this.handleUpdateDB = debounce(this.handleUpdateDB, 500);
    this.handleFetchReminders();
  };

  componentWillUnmount = () => {
    if (this.handleFetchReminders.cancel) this.handleFetchReminders.cancel();
    if (this.handleUpdateDB.cancel) this.handleUpdateDB.cancel();
  };

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

  handleUpdateDB = ({ id, status }) => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;
    updateReminder({ userId, id, status });
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
      await createReminder({ userId, title, label, dueDate });
      await this.handleFetchReminders();
    } finally {
      this.setState({ loading: false });
      logEvent({
        event: 'Reminders- Create Reminder',
        props: { Label: label }
      });
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

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(Reminders));
