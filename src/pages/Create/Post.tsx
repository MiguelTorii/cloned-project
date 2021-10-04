import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import withRoot from "../../withRoot";
import Layout from "../../containers/Layout/Layout";
import CreatePost from "../../containers/CreatePostLayout/CreatePostLayout";
type Props = {
  match: {
    params: {
      postId: string;
    };
  };
};

const CreatePostPage = (props: Props) => {
  const {
    match: {
      params: {
        postId
      }
    }
  } = props;
  return <main>
      <CssBaseline />
      <Layout>
        <Grid container>
          <Grid item xs={12} sm={12} md={12}>
            <CreatePost postId={postId} />
          </Grid>
        </Grid>
      </Layout>
    </main>;
};

export default withRoot(CreatePostPage);