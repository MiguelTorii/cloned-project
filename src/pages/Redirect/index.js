// @flow

import React from 'react';
import queryString from 'query-string';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import withRoot from '../../withRoot';
import Redirect from '../../containers/Redirect';

const styles = () => ({});

type ProvidedProps = {
  classes: Object
};

type Props = {
  classes: Object,
  location: {
    search: string
  }
};

type State = {
  nonce: string
};

class RedirectPage extends React.Component<ProvidedProps & Props, State> {
  state = {
    nonce: ''
  };

  componentDidMount = () => {
    const {
      location: { search = '' }
    } = this.props;
    const values = queryString.parse(search);
    const { nonce = '' } = values;
    this.setState({ nonce });
  };

  render() {
    const { classes } = this.props;
    const { nonce } = this.state;

    return (
      <main className={classes.main}>
        <CssBaseline />
        {nonce !== '' && <Redirect nonce={nonce} />}
      </main>
    );
  }
}

export default withRoot(withStyles(styles)(RedirectPage));
