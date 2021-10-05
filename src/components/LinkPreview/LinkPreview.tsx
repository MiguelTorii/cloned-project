import React from 'react';
import validate from 'validate.js';
import normalizeUrl from 'normalize-url';
import MicrolinkCard from '@microlink/react';
import { withStyles } from '@material-ui/core/styles';
import { styles } from '../_styles/LinkPreview';

type Props = {
  classes: Record<string, any>;
  uri: string;
};
type State = {};

class LinkPreview extends React.PureComponent<Props, State> {
  parseURL = (uri) => {
    try {
      return normalizeUrl(uri);
    } catch (err) {
      return '';
    }
  };

  render() {
    const { classes, uri } = this.props;
    const url = this.parseURL(uri);

    if (
      validate(
        {
          website: url
        },
        {
          website: {
            url: true
          }
        }
      )
    ) {
      return '';
    }

    return (
      <div className={classes.container}>
        <MicrolinkCard url={url} size="large" target="_blank" />
      </div>
    );
  }
}

export default withStyles(styles as any)(LinkPreview);
