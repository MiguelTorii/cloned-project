// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout';
import ViewNotes from '../../containers/ViewNotes';

const styles = () => ({
  item: {
    display: 'flex'
  }
});

type Props = {
  classes: Object,
  match: {
    params: {
      noteId: string
    }
  }
};

const PostPage = ({ classes, match }: Props) => {
  const {
    params: { noteId }
  } = match

  return (
    <main>
      <CssBaseline />
      <Layout>
        <Grid container spacing={0}>
          <Grid item xs={12} className={classes.item}>
            {noteId && <ViewNotes noteId={noteId} />}
          </Grid>
        </Grid>
      </Layout>
    </main>
  );
}

export default withRoot(withStyles(styles)(PostPage));
