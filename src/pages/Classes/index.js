// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withWidth from '@material-ui/core/withWidth';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout';
import ClassesGrid from '../../containers/ClassesGrid';

const Classes = () => {
  return (
    <main>
      <CssBaseline />
      <Layout>
        <ClassesGrid />
      </Layout>
    </main>
  );
};

export default withRoot(withWidth()(Classes));
