// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout';
import ViewQuestion from '../../containers/ViewQuestion';

const styles = () => ({
  item: {
    display: 'flex'
  }
});

type Props = {
  classes: Object,
  match: {
    params: {
      questionId: string
    }
  }
};

const QuestionPage = ({ classes, match }: Props) => {
  const {
    params: { questionId }
  } = match

  return (
    <main>
      <CssBaseline />
      <Layout>
        <Grid container spacing={0}>
          <Grid item xs={12} className={classes.item}>
            {questionId && <ViewQuestion questionId={questionId} />}
          </Grid>
        </Grid>
      </Layout>
    </main>
  );
}

export default withRoot(withStyles(styles)(QuestionPage));
