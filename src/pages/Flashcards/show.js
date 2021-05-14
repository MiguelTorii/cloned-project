import React from 'react';
import CssBaseline from "@material-ui/core/CssBaseline";
import Layout from '../../containers/Layout';
import FlashcardsShow from '../../containers/FlashcardsShow';
import withRoot from '../../withRoot';

const FlashcardsShowPage = () => {
  return (
    <main>
      <CssBaseline />
      <Layout>
        <FlashcardsShow />
      </Layout>
    </main>
  );
};

export default withRoot(FlashcardsShowPage);
