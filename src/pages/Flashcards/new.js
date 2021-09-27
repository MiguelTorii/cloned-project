import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout/Layout';
import FlashcardsNew from '../../containers/FlashcardsNew/FlashcardsNew';

const FlashcardsNewPage = () => (
  <main>
    <CssBaseline />
    <Layout>
      <FlashcardsNew />
    </Layout>
  </main>
);

export default withRoot(FlashcardsNewPage);
