// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withRoot from '../../withRoot';
import Canvas from '../../containers/Canvas/Canvas';

type Props = {
  match: {
    params: {
      nonce: string
    }
  }
};

type State = {
  nonce: string
};

class CanvasPage extends React.Component<Props, State> {
  state = {
    nonce: ''
  };

  componentDidMount = () => {
    const {
      match: {
        params: { nonce = '' }
      }
    } = this.props;
    if (nonce !== '') {
      this.setState({ nonce });
    }
  };

  render() {
    const { nonce } = this.state;
    return (
      <main>
        <CssBaseline />
        {nonce !== '' && <Canvas nonce={nonce} />}
      </main>
    );
  }
}

export default withRoot(CanvasPage);
