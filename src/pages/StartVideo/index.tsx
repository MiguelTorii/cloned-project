import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import withStyles from "@material-ui/core/styles/withStyles";
import withRoot from "../../withRoot";
import Layout from "../../containers/Layout/Layout";
import StartVideo from "../../containers/StartVideo/StartVideo";

const styles = () => ({});

type Props = {
  classes: Record<string, any>;
};

class StartVideoPage extends React.Component<Props> {
  componentDidMount = () => {};

  render() {
    const {
      classes
    } = this.props;
    return <main className={classes.main}>
        <CssBaseline />
        <Layout>
          <StartVideo />
        </Layout>
      </main>;
  }

}

export default withRoot(withStyles(styles)(StartVideoPage));