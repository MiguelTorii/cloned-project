// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout';
import CreateShareLink from '../../containers/CreatePostLayout';
// import PostTips from '../../components/PostTips';

type Props = {
  match: {
    params: {
      sharelinkId: string
    }
  }
};

const CreateShareLinkPage = (props: Props) => {
  const { match: { params: { sharelinkId } } } = props

  return (
    <main>
      <CssBaseline />
      <Layout>
        <Grid container>
          <Grid item xs={12} sm={12} md={12}>
            <CreateShareLink sharelinkId={sharelinkId} />
          </Grid>
          {/* <Grid item xs={12} sm={12} md={3}>
            <PostTips type="shareLink" />
          </Grid> */}
        </Grid>
      </Layout>
    </main>
  );
};

export default withRoot(CreateShareLinkPage);
