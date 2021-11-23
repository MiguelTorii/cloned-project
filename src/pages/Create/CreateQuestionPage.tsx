import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout/Layout';
import CreatePostLayout from '../../containers/CreatePostLayout/CreatePostLayout';

type Props = {
  match: {
    params: {
      questionId: number;
    };
  };
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
            <CreatePostLayout questionId={questionId} />
          </Grid>
        </Grid>
      </Layout>
    </main>
  );
};

export default withRoot(CreateQuestionPage);
