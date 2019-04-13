// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout';
import CreateQuestion from '../../containers/CreateQuestion';

const CreateQuestionPage = () => {
  return (
    <main>
      <CssBaseline />
      <Layout>
        <CreateQuestion />
      </Layout>
    </main>
  );
};

export default withRoot(CreateQuestionPage);
