import React from "react";
import * as Sentry from "@sentry/browser";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";

const styles = () => ({});

type Props = {
  classes: Record<string, any>;
  children: Record<string, any> | Array<Record<string, any>>;
};
type State = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<Props, State> {
  state = {
    hasError: false
  };

  componentDidCatch(error: Error, info: Record<string, any>) {
    this.setState({
      hasError: true
    });

    if (process.env.NODE_ENV !== 'development') {
      if (!this.skip(error)) {
        console.log('Debug:', error, JSON.stringify(error));
        Sentry.captureException(error, {
          extra: info
        });
      }
    } else {
      // TODO replace this with more appropriate error handler
      console.error('Boundary: ', error);
    }
  }

  skip = (error: Error) => {
    if (JSON.stringify(error).includes('transition is invalid while previous transition is still in progress')) {
      return true;
    }

    return false;
  };

  render() {
    const {
      classes,
      children
    } = this.props;
    const {
      hasError
    } = this.state;

    if (hasError) {
      return <div className={classes.root}>
          <Typography variant="subtitle1" paragraph>
            {"We're sorry — something went wrong."}
          </Typography>
          <Typography variant="subtitle1" paragraph>
            Our team has been notified
          </Typography>
        </div>;
    }

    return children;
  }

}

export default withStyles(styles)(ErrorBoundary);