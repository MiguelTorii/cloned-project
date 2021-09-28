// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import { useParams } from 'react-router';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout/Layout';
import ViewFlashcards from '../../containers/ViewFlashcards/ViewFlashcards';

const styles = () => ({
  item: {
    display: 'flex'
  }
});

type Props = {
  classes: Object
};

const FlashcardsPage = ({ classes }: Props) => {
  const { flashcardId } = useParams();

  return (
    <main>
      <CssBaseline />
      <Layout>
        <Grid container spacing={0}>
          <Grid item xs={12} className={classes.item}>
            {flashcardId && <ViewFlashcards flashcardId={flashcardId} />}
          </Grid>
        </Grid>
      </Layout>
    </main>
  );
};

export default withRoot(withStyles(styles)(FlashcardsPage));
