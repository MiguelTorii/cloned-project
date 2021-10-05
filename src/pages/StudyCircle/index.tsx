import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout/Layout';
import StudyCircle from '../../containers/StudyCircle/StudyCircle';

const styles = () => ({});

type ProvidedProps = {
  classes: Record<string, any>;
};
type Props = {
  classes: Record<string, any>;
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

export default withRoot(withStyles(styles as any)(StudyCirclePage));
