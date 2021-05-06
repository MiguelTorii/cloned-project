import React from 'react';
import withRoot from '../../withRoot';
import CssBaseline from "@material-ui/core/CssBaseline";
import Layout from '../../containers/Layout';
import FlashcardsList from '../../containers/FlashcardsList';

const FlashcardsListPage = () => {
  return (
    <main>
      <CssBaseline />
      <Layout>
        <FlashcardsList />
      </Layout>
    </main>
  );
};

export default withRoot(FlashcardsListPage);
