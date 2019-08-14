// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout';
import CreateQuestion from '../../containers/CreateQuestion';
import PostTips from '../../components/PostTips';

const CreateQuestionPage = () => {
  return (
    <main>
      <CssBaseline />
      <Layout>
        <Grid container>
          <Grid item xs={12} sm={9}>
            <CreateQuestion />
          </Grid>
          <Grid item xs={12} sm={3}>
            <PostTips type="question" />
          </Grid>
        </Grid>
      </Layout>
    </main>
  );
};

export default withRoot(CreateQuestionPage);
