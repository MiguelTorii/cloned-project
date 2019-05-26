// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withRoot from '../../withRoot';
import Canvas from '../../containers/Canvas';

type ProvidedProps = {
  classes: Object
};

type Props = {
  classes: Object,
  match: {
    params: {
      nonce: string
    }
  }
};

type State = {
  nonce: string
};

class CanvasPage extends React.Component<ProvidedProps & Props, State> {
  state = {
    nonce: ''
  };

  componentDidMount = () => {
    const {
      match: {
        params: { nonce = '' }
      }
    } = this.props;
    if (nonce !== '') this.setState({ nonce });
  };

  render() {
    const { classes } = this.props;
    const { nonce } = this.state;
    return (
      <main className={classes.main}>
        <CssBaseline />
        {nonce !== '' && <Canvas nonce={nonce} />}
      </main>
    );
  }
}

export default withRoot(CanvasPage);
