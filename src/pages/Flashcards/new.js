import React from 'react';
import withRoot from '../../withRoot';
import CssBaseline from '@material-ui/core/CssBaseline';
import Layout from '../../containers/Layout/Layout';
import FlashcardsNew from '../../containers/FlashcardsNew/FlashcardsNew';

const FlashcardsNewPage = () => {
  return (
    <main>
      <CssBaseline />
      <Layout>
        <FlashcardsNew />
      </Layout>
    </main>
  );
};

export default withRoot(FlashcardsNewPage);
