import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import withWidth from '@material-ui/core/withWidth';

import ClassesGrid from 'containers/ClassesGrid/Classes';
import Layout from 'containers/Layout/Layout';
import withRoot from 'withRoot';

const Classes = () => (
  <main>
    <CssBaseline />
    <Layout>
      <ClassesGrid />
    </Layout>
  </main>
);

export default withRoot(withWidth()(Classes));
