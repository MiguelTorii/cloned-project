// @flow

import React from 'react';
import queryString from 'query-string';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import withRoot from '../../withRoot';
import OAuth from '../../containers/OAuth';

const styles = () => ({});

type Props = {
  classes: Object,
  location: {
    search: string
  }
};

type State = {
  code: string,
  state: string
};

class OAuthPage extends React.Component<Props, State> {
  state = {
    code: '',
    state: ''
  };

  componentDidMount = () => {
    const {
      location: { search = {} }
    } = this.props;
    const values = queryString.parse(search);
    console.log(values);
    const { code = '', state = '' } = values;
    this.setState({ code, state });
  };

  render() {
    const { classes } = this.props;
    const { code, state } = this.state;
    return (
      <main className={classes.main}>
        <CssBaseline />
        {code !== '' && state !== '' && <OAuth code={code} state={state} />}
      </main>
    );
  }
}

export default withRoot(withStyles(styles)(OAuthPage));
