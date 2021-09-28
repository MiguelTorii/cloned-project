import React from 'react';
import queryString from 'query-string';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import withRoot from '../../withRoot';
import OAuth from '../../containers/OAuth/OAuth';

const styles = () => ({});

type Props = {
  classes: Record<string, any>;
  location: {
    search: string;
  };
};
type State = {
  code: string;
  state: string;
};

class OAuthPage extends React.Component<Props, State> {
  state = {
    code: '',
    state: ''
  };

  componentDidMount = () => {
    const {
      location: { search = '' }
    } = this.props;
    const values = queryString.parse(search);
    const { code = '', state = '' } = values;
    this.setState({
      code: code as string,
      state: state as string
    });
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

export default withRoot(withStyles(styles as any)(OAuthPage));
