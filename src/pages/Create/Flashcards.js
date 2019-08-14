// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout';
import CreateFlashcards from '../../containers/CreateFlashcards';
import PostTips from '../../components/PostTips';

const CreateShareLinkPage = () => {
  return (
    <main>
      <CssBaseline />
      <Layout>
        <Grid container>
          <Grid item xs={12} sm={9}>
            <CreateFlashcards />
          </Grid>
          <Grid item xs={12} sm={3}>
            <PostTips type="flashcards" />
          </Grid>
        </Grid>
      </Layout>
    </main>
  );
};

export default withRoot(CreateShareLinkPage);
