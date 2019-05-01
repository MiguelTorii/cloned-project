// @flow
import React from 'react';
import normalizeUrl from 'normalize-url';
import MicrolinkCard from '@microlink/react';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  container: {}
});

type Props = {
  classes: Object,
  uri: string
};

type State = {};

class LinkPreview extends React.PureComponent<Props, State> {
  render() {
    const { classes, uri } = this.props;
    const url = normalizeUrl(uri);
    return (
      <div className={classes.container}>
        <MicrolinkCard url={url} size="large" target="_blank" />
      </div>
    );
  }
}

export default withStyles(styles)(LinkPreview);
