import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';

import CanvasLogin from 'containers/CanvasLogin/CanvasLogin';
import withRoot from 'withRoot';

type Props = {
  match: {
    params: {
      nonce: string;
    };
  };
};
type State = {
  nonce: string;
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
      this.setState({
        nonce
      });
    }
  };

  render() {
    const { nonce } = this.state;
    return (
      <main>
        <CssBaseline />
        {nonce !== '' && <CanvasLogin nonce={nonce} />}
      </main>
    );
  }
}

export default withRoot(CanvasPage);
