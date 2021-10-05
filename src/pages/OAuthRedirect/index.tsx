import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import withStyles from "@material-ui/core/styles/withStyles";
import withRoot from "../../withRoot";
import OAuth from "../../containers/OAuthRedirect/OAuthRedirect";

const styles = () => ({});

type Props = {
  classes: Record<string, any>;
  history: {
    locatoin: Record<string, any>;
  };
};

const OAuthPage = ({
  classes,
  history: {
    location
  }
}: Props) => <main className={classes.main}>
    <CssBaseline />
    <OAuth search={location.search} />
  </main>;

export default withRoot(withStyles(styles)(OAuthPage));