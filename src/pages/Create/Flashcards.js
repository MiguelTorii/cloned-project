// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout';
import CreateFlashcards from '../../containers/CreateFlashcards';
import PostTips from '../../components/PostTips';

type Props = {
  match: {
    params: {
      flashcardId: string
    }
  }
};

const CreateShareLinkPage = (props: Props) => {
  const {match: {params: { flashcardId }}} = props
  return (
    <main>
      <CssBaseline />
      <Layout>
        <Grid container>
          <Grid item xs={12} sm={9}>
            <CreateFlashcards flashcardId={flashcardId}/>
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
