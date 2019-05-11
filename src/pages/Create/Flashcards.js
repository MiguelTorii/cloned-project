// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout';
import CreateFlashcards from '../../containers/CreateFlashcards';

const CreateShareLinkPage = () => {
  return (
    <main>
      <CssBaseline />
      <Layout>
        <CreateFlashcards />
      </Layout>
    </main>
  );
};

export default withRoot(CreateShareLinkPage);
