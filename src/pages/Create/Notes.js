// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout';
import CreateNotes from '../../containers/CreateNotes';
import PostTips from '../../components/PostTips';

type Props = {
  match: {
    params: {
      noteId: string
    }
  }
};

const CreateNotesPage = (props: Props) => {
  const {match: {params: { noteId }}} = props

  return (
    <main>
      <CssBaseline />
      <Layout>
        <Grid container>
          <Grid item xs={12} sm={9}>
            <CreateNotes noteId={noteId} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <PostTips type="notes" />
          </Grid>
        </Grid>
      </Layout>
    </main>
  );
};

export default withRoot(CreateNotesPage);
