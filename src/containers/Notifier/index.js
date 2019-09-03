// @flow

import React from 'react';
import { withSnackbar } from 'notistack';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import type { State as StoreState } from '../../types/state';
import * as notificationsActions from '../../actions/notifications';

type Props = {
  notifications: Array<Object>,
  enqueueSnackbar: Function,
  removeSnackbar: Function
};

class Notifier extends React.Component<Props> {
  componentDidMount = async () => {};

  shouldComponentUpdate = ({ notifications: newSnacks = [] }) => {
    if (!newSnacks.length) {
      this.displayed = [];
      return false;
    }

    const {
      notifications: currentSnacks,
      closeSnackbar,
      removeSnackbar
    } = this.props;
    let notExists = false;
    for (let i = 0; i < newSnacks.length; i += 1) {
      const newSnack = newSnacks[i];
      if (newSnack.dismissed) {
        closeSnackbar(newSnack.key);
        removeSnackbar(newSnack.key);
      }

      if (!notExists)
        notExists =
          notExists ||
          !currentSnacks.filter(({ key }) => newSnack.key === key).length;
    }
    return notExists;
  };

  componentDidUpdate = () => {
    const { notifications = [], enqueueSnackbar, removeSnackbar } = this.props;

    notifications.forEach(({ key, message, options = {} }) => {
      if (this.displayed.includes(key)) return;
      enqueueSnackbar(message, {
        ...options,
        onClose: (event, reason, id) => {
          if (options.onClose) {
            options.onClose(event, reason, id);
          }
          removeSnackbar(id);
        }
      });
      this.storeDisplayed(key);
    });
  };

  storeDisplayed = id => {
    this.displayed = [...this.displayed, id];
  };

  render() {
    return null;
  }
}

const mapStateToProps = ({ notifications }: StoreState): {} => ({
  notifications
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      removeSnackbar: notificationsActions.removeSnackbar
    },
    dispatch
  );

export default withSnackbar(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Notifier)
);
