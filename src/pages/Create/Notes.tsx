import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout/Layout';
import CreateNotes from '../../containers/CreatePostLayout/CreatePostLayout';

type Props = {
  match: {
    params: {
      noteId: number;
    };
  };
};

const CreateNotesPage = (props: Props) => {
  const {
    match: {
      params: { noteId }
    }
  } = props;
  return (
    <main>
      <CssBaseline />
      <Layout>
        <Grid container>
          <Grid item sm={12} md={12}>
            <CreateNotes noteId={noteId} />
          </Grid>
          {/* <Grid item sm={12} md={3}>
           <PostTips type="notes" />
          </Grid> */}
        </Grid>
      </Layout>
    </main>
  );
};

export default withRoot(CreateNotesPage);