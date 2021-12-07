import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import FlashcardsList from '../../containers/FlashcardsList/FlashcardsList';
import Layout from '../../containers/Layout/Layout';
import withRoot from '../../withRoot';

const FlashcardsListPage = () => (
  <main>
    <CssBaseline />
    <Layout>
      <FlashcardsList />
    </Layout>
  </main>
);

export default withRoot(FlashcardsListPage);
