// @flow

import React from 'react';
import withWidth from '@material-ui/core/withWidth';
import FloatingChat from './FloatingChat';
import ErrorBoundary from '../ErrorBoundary';

type Props = {
  width: string
};

class Chat extends React.PureComponent<Props> {
  render() {
    const { width } = this.props;
    return <ErrorBoundary>{width !== 'xs' && <FloatingChat />}</ErrorBoundary>;
  }
}

export default withWidth()(Chat);
