// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import withRoot from '../../withRoot';

const styles = () => ({});

type ProvidedProps = {
  classes: Object
};

type Props = {
  classes: Object
};

type State = {
  text: string
};

class Sandbox extends React.Component<ProvidedProps & Props, State> {
  state = {};

  componentDidMount = () => {};

  render() {
    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <CssBaseline />
        <a href="https://redirect.circleinapp.com/login?nonce=blah">
          https://redirect.circleinapp.com/login?nonce=blah
        </a>
        <a href="https://redirect-dev.circleinapp.com/login?nonce=blah">
          https://redirect-dev.circleinapp.com/login?nonce=blah
        </a>
      </main>
    );
  }
}

export default withRoot(withStyles(styles)(Sandbox));
