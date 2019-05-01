// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout';
import ViewFlashcards from '../../containers/ViewFlashcards';

const styles = () => ({
  item: {
    display: 'flex'
  }
});

type Props = {
  classes: Object,
  match: {
    params: {
      flashcardId: string
    }
  }
};

type State = {
  flashcardId: ?number
};

class FlashcardsPage extends React.Component<Props, State> {
  state = {
    flashcardId: null
  };

  componentDidMount = () => {
    const {
      match: {
        params: { flashcardId }
      }
    } = this.props;
    this.setState({ flashcardId: Number(flashcardId) });
  };

  render() {
    const { classes } = this.props;
    const { flashcardId } = this.state;
    return (
      <main>
        <CssBaseline />
        <Layout>
          <Grid container spacing={0}>
            <Grid item xs={12} className={classes.item}>
              {flashcardId && <ViewFlashcards flashcardId={flashcardId} />}
            </Grid>
          </Grid>
        </Layout>
      </main>
    );
  }
}

export default withRoot(withStyles(styles)(FlashcardsPage));
