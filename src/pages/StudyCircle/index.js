// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout';
import StudyCircle from '../../containers/StudyCircle';

const styles = () => ({});

type ProvidedProps = {
  classes: Object
};

type Props = {
  classes: Object
};

type State = {};

class StudyCirclePage extends React.Component<ProvidedProps & Props, State> {
  componentDidMount = () => {};

  render() {
    const { classes } = this.props;
    return (
      <main className={classes.main}>
        <CssBaseline />
        <Layout>
          <StudyCircle />
        </Layout>
      </main>
    );
  }
}

export default withRoot(withStyles(styles)(StudyCirclePage));
