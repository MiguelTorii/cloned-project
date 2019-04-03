// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import withRoot from '../../withRoot';
import Layout from '../../containers/layout';
import CreateQuestion from '../../containers/create-question';

const styles = () => ({});

type Props = {
  match: {
    params: {
      type: string
    }
  }
};

type State = {
  type: string
};

class CreatePage extends React.Component<Props, State> {
  state = {
    type: ''
  };

  componentDidMount = () => {
    const {
      match: {
        params: { type = '' }
      }
    } = this.props;
    if (type !== '') this.setState({ type });
  };

  renderType = () => {
    const { type } = this.state;
    switch (type) {
      case 'question':
        return <CreateQuestion />;
      default:
        return null;
    }
  };

  render() {
    return (
      <main>
        <CssBaseline />
        <Layout>{this.renderType()}</Layout>
      </main>
    );
  }
}

export default withRoot(withStyles(styles)(CreatePage));
