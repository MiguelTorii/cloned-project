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
        <a href="circlein.app">circlein.app</a>
        <a href="https://redirect.circleinapp.com/share/abc">
          https://redirect.circleinapp.com/share/abc
        </a>
        <a href="https://bit.ly/2lAcUt2">https://bit.ly/2lAcUt2</a>
        <a href="https://circlein.app">https://circlein.app</a>
        <a href="https://app.circleinapp.com">https://app.circleinapp.com</a>
      </main>
    );
  }
}

export default withRoot(withStyles(styles)(Sandbox));
