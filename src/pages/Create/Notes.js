// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout';
import CreateNotes from '../../containers/CreateNotes';

const CreateNotesPage = () => {
  return (
    <main>
      <CssBaseline />
      <Layout>
        <CreateNotes />
      </Layout>
    </main>
  );
};

export default withRoot(CreateNotesPage);
