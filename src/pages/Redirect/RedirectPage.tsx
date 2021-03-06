import React from 'react';

import queryString from 'query-string';

import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';

import Redirect from 'containers/Redirect/Redirect';
import withRoot from 'withRoot';

import type { ParsedQuery } from 'query-string';

const styles = () => ({});

type ProvidedProps = {
  classes: Record<string, any>;
};
type Props = {
  classes: Record<string, any>;
  location: {
    search: string;
  };
};
type State = {
  nonce: string;
};

class RedirectPage extends React.Component<ProvidedProps & Props, State> {
  state = {
    nonce: ''
  };

  componentDidMount = () => {
    const {
      location: { search = '' }
    } = this.props;
    const values: ParsedQuery<string> = queryString.parse(search);
    const nonce = values.nonce as string;
    this.setState({
      nonce: nonce || ''
    });
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

export default withRoot(withStyles(styles as any)(RedirectPage));
