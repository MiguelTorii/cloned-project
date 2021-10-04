import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import withStyles from "@material-ui/core/styles/withStyles";
import withRoot from "../../withRoot";
import Layout from "../../containers/Layout/Layout";
import Reminders from "../../containers/Reminders/Reminders";

const styles = () => ({});

type Props = {
  classes: Record<string, any>;
};
type State = {};

class RemindersPage extends React.Component<Props, State> {
  componentDidMount = () => {};

  render() {
    const {
      classes
    } = this.props;
    return <main className={classes.main}>
        <CssBaseline />
        <Layout>
          <Reminders />
        </Layout>
      </main>;
  }

}

export default withRoot(withStyles(styles)(RemindersPage));