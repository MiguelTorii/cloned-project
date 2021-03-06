import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';

import CreateShareLink from 'containers/CreatePostLayout/CreatePostLayout';
import Layout from 'containers/Layout/Layout';
import withRoot from 'withRoot';

type Props = {
  match: {
    params: {
      sharelinkId: number;
    };
  };
};

const CreateShareLinkPage = (props: Props) => {
  const {
    match: {
      params: { sharelinkId }
    }
  } = props;
  return (
    <main>
      <CssBaseline />
      <Layout>
        <Grid container>
          <Grid item xs={12} sm={12} md={12}>
            <CreateShareLink sharelinkId={sharelinkId} />
          </Grid>
        </Grid>
      </Layout>
    </main>
  );
};

export default withRoot(CreateShareLinkPage);
