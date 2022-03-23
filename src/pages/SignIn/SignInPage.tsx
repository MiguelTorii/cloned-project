import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';

import SignIn from 'containers/SignIn/SignIn';
import withRoot from 'withRoot';

const styles = () => ({});

type ProvidedProps = {
  classes: Record<string, any>;
};
type Props = {
  classes: Record<string, any>;
};
type State = {};

class SignInPage extends React.Component<ProvidedProps & Props, State> {
  componentDidMount = () => {};

  render() {
    const { classes } = this.props;
    return (
      <main className={classes.main}>
        <CssBaseline />
        <SignIn />
      </main>
    );
  }
}

export default withRoot(withStyles(styles as any)(SignInPage));
