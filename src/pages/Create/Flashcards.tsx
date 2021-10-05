import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import { useParams } from 'react-router';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout/Layout';
import CreateFlashcards from '../../containers/CreateFlashcards/CreateFlashcards';
import PostTips from '../../components/PostTips/PostTips';

const CreateShareLinkPage = () => {
  const { flashcardId } = useParams();
  return (
    <main>
      <CssBaseline />
      <Layout>
        <Grid container>
          <Grid item xs={12} sm={12} md={9}>
            <CreateFlashcards flashcardId={flashcardId} />
          </Grid>
          <Grid item xs={12} md={3}>
            <PostTips type="flashcards" />
          </Grid>
        </Grid>
      </Layout>
    </main>
  );
};

export default withRoot(CreateShareLinkPage);
