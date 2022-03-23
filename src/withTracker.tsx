import type { ComponentType } from 'react';
import React, { memo, useEffect, useState } from 'react';

import ReactGA from 'react-ga';

const withTracker = (WrappedComponent: ComponentType<any>, options: Record<string, any> = {}) => {
  const trackPage = (page) => {
    ReactGA.set({
      page,
      ...options
    });
    ReactGA.pageview(page);
  };

  type Props = {
    location: Record<string, any>;
  };

  const WithTracker = ({ location: { pathname }, ...rest }: Props) => {
    const [prevPathname, setPrevPathname] = useState('');
    useEffect(() => {
      if (prevPathname !== pathname) {
        trackPage(pathname);
        setPrevPathname(pathname);
      }
    }, [pathname, prevPathname]);
    return <WrappedComponent {...rest} />;
  };

  return memo(WithTracker);
};

export default withTracker;
