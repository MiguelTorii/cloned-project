// @flow
import React from 'react';
import MicrolinkCard from '@microlink/react';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  container: {}
});

type Props = {
  classes: Object,
  url: string
};

type State = {};

class PostItemLink extends React.PureComponent<Props, State> {
  render() {
    const { classes, url } = this.props;

    return (
      <div className={classes.container}>
        <MicrolinkCard url={url} size="large" target="_blank" />
      </div>
    );
  }
}

export default withStyles(styles)(PostItemLink);
