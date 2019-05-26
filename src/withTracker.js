// @flow

import React, { Component } from 'react';
import ReactGA from 'react-ga';

export default function withTracker(
  WrappedComponent: Object,
  options: Object = {}
) {
  const trackPage = page => {
    ReactGA.set({
      page,
      ...options
    });
    ReactGA.pageview(page);
  };

  type Props = {
    location: Object
  };

  return class WithTracker extends Component<Props> {
    componentDidMount() {
      const {
        location: { pathname }
      } = this.props;
      trackPage(pathname);
    }

    componentWillReceiveProps(nextProps: Object) {
      const {
        location: { pathname }
      } = this.props;
      const {
        location: { pathname: nextPathname }
      } = nextProps;

      if (pathname !== nextPathname) {
        trackPage(nextPathname);
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
