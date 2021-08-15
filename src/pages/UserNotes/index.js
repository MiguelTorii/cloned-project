// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withWidth from '@material-ui/core/withWidth';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout';
import UserNotesContainer from '../../containers/UserNotes';
import { NotesContextProvider } from '../../hooks/useNotes';

const UserNotes = () => {
  return (
    <main>
      <CssBaseline />
      <Layout>
        <NotesContextProvider>
          <UserNotesContainer />
        </NotesContextProvider>
      </Layout>
    </main>
  );
};

export default withRoot(withWidth()(UserNotes));
