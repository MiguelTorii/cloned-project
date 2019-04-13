// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout';
import CreateQuestion from '../../containers/CreateQuestion';

type Props = {
  match: {
    params: {
      id: string
    }
  }
};

const EditQuestionPage = (props: Props) => {
  const {
    match: {
      params: { id = '' }
    }
  } = props;

  return (
    <main>
      <CssBaseline />
      <Layout>
        <CreateQuestion id={id} />
      </Layout>
    </main>
  );
};

export default withRoot(EditQuestionPage);
