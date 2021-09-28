// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout/Layout';
import CreateQuestion from '../../containers/CreatePostLayout/CreatePostLayout';
// import PostTips from '../../components/PostTips';

type Props = {
  match: {
    params: {
      questionId: string
    }
  }
};

const CreateQuestionPage = (props: Props) => {
  const {
    match: {
      params: { questionId }
    }
  } = props;

  return (
    <main>
      <CssBaseline />
      <Layout>
        <Grid container>
          <Grid item xs={12} sm={12} md={12}>
            <CreateQuestion questionId={questionId} />
          </Grid>
          {/* <Grid item xs={12} sm={12} md={3}>
            <PostTips type="question" />
          </Grid> */}
        </Grid>
      </Layout>
    </main>
  );
};

export default withRoot(CreateQuestionPage);
