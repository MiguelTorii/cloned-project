// @flow

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import withWidth from '@material-ui/core/withWidth';
import type { State as StoreState } from '../../types/state';
import type { UserState } from '../../reducers/user';
import FloatingChat from './FloatingChat';
import ErrorBoundary from '../ErrorBoundary';

type Props = {
  width: string,
  user: UserState,
  location: {
    pathname: string
  }
};

class Chat extends React.PureComponent<Props> {
  render() {
    const {
      user: {
        data: { userId }
      },
      width,
      location: { pathname }
    } = this.props;

    if (!userId || userId === '') return null;
    if (pathname.includes('video-call')) return null;
    return <ErrorBoundary>{width !== 'xs' && <FloatingChat />}</ErrorBoundary>;
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default withRouter(
  connect(
    mapStateToProps,
    null
  )(withWidth()(Chat))
);
