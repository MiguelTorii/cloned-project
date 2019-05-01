// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout';
import CreateShareLink from '../../containers/CreateShareLink';

const CreateShareLinkPage = () => {
  return (
    <main>
      <CssBaseline />
      <Layout>
        <CreateShareLink />
      </Layout>
    </main>
  );
};

export default withRoot(CreateShareLinkPage);
