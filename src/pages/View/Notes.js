// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout';
import ViewNotes from '../../containers/ViewNotes';

const styles = () => ({
  item: {
    display: 'flex'
  }
});

type Props = {
  classes: Object,
  match: {
    params: {
      noteId: string
    }
  }
};

type State = {
  noteId: ?number
};

class PostPage extends React.Component<Props, State> {
  state = {
    noteId: null
  };

  componentDidMount = () => {
    const {
      match: {
        params: { noteId }
      }
    } = this.props;
    this.setState({ noteId: Number(noteId) });
  };

  render() {
    const { classes } = this.props;
    const { noteId } = this.state;
    return (
      <main>
        <CssBaseline />
        <Layout>
          <Grid container spacing={0}>
            <Grid item xs={12} className={classes.item}>
              {noteId && <ViewNotes noteId={noteId} />}
            </Grid>
          </Grid>
        </Layout>
      </main>
    );
  }
}

export default withRoot(withStyles(styles)(PostPage));
