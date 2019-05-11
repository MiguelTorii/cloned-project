// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import withRoot from '../../withRoot';
import SignUp from '../../containers/SignUp';

const styles = () => ({});

type Props = {
  classes: Object
};

class SignUpPage extends React.Component<Props> {
  componentDidMount = () => {};

  render() {
    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <CssBaseline />
        <SignUp />
      </main>
    );
  }
}

export default withRoot(withStyles(styles)(SignUpPage));
