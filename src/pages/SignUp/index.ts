// @flow

import React from 'react';
import queryString from 'query-string';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import withRoot from '../../withRoot';
import SignUp from '../../containers/SignUp/SignUp';

const styles = () => ({});

type Props = {
  classes: Object,
  location: {
    search: string
  }
};

type State = {
  email: string,
  loading: boolean
};

class SignUpPage extends React.Component<Props, State> {
  state = {
    email: '',
    loading: true
  };

  componentDidMount = () => {
    const {
      location: { search = {} }
    } = this.props;
    const values = queryString.parse(search);
    const { email } = values;

    this.setState({ email, loading: false });
  };

  render() {
    const { classes } = this.props;
    const { email, loading } = this.state;
    if (loading) {
      return null;
    }

    return (
      <main className={classes.main}>
        <CssBaseline />
        <SignUp email={email} />
      </main>
    );
  }
}

export default withRoot(withStyles(styles)(SignUpPage));
