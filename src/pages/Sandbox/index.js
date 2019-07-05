/* eslint-disable jsx-a11y/mouse-events-have-key-events */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import withRoot from '../../withRoot';
import * as webNotificationsActions from '../../actions/web-notifications';

const styles = () => ({
  main: {}
});

type Props = {
  classes: Object
};

type State = {};

class SignInPage extends React.Component<Props, State> {
  state = {};

  handleButtonClick = () => {
    const { updateTitle } = this.props;
    updateTitle('TEST');
  };

  render() {
    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <CssBaseline />
        <div>
          <button type="submit" onClick={this.handleButtonClick}>
            Notif!
          </button>
        </div>
      </main>
    );
  }
}

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      updateTitle: webNotificationsActions.updateTitle
    },
    dispatch
  );

export default withRoot(
  connect(
    null,
    mapDispatchToProps
  )(withStyles(styles)(SignInPage))
);
