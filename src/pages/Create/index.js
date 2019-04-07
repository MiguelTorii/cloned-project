// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout';
import CreateQuestion from '../../containers/CreateQuestion';

const styles = () => ({});

type Props = {
  match: {
    params: {
      type: string
    }
  }
};

class CreatePage extends React.Component<Props> {
  renderType = type => {
    switch (type) {
      case 'question':
        return <CreateQuestion />;
      default:
        return null;
    }
  };

  render() {
    const {
      match: {
        params: { type = '' }
      }
    } = this.props;
    return (
      <main>
        <CssBaseline />
        <Layout>{this.renderType(type)}</Layout>
      </main>
    );
  }
}

export default withRoot(withStyles(styles)(CreatePage));
