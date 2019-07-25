/* eslint-disable jsx-a11y/mouse-events-have-key-events */

import React from 'react';
import { connect } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import withRoot from '../../withRoot';
import TermsOfUse from '../../components/TermsOfUse';

const styles = theme => ({
  main: {
    padding: theme.spacing.unit
  }
});

type Props = {
  classes: Object
};

type State = {};

class Sandbox extends React.Component<Props, State> {
  state = {};

  render() {
    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <CssBaseline />
        <TermsOfUse />
      </main>
    );
  }
}

export default withRoot(
  connect(
    null,
    null
  )(withStyles(styles)(Sandbox))
);
