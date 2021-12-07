import React from 'react';
import { Grid } from '@material-ui/core';
import FlashcardsShow from '../../containers/FlashcardsShow/FlashcardsShow';
import Layout from '../../containers/Layout/Layout';

const FlashcardsShowPage = () => (
  <main>
    <Layout>
      <Grid container justifyContent="center">
        <Grid item xs={11} lg={10}>
          <FlashcardsShow />
        </Grid>
      </Grid>
    </Layout>
  </main>
);

export default FlashcardsShowPage;
