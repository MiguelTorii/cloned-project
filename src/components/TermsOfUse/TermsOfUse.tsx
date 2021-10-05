import React from 'react';
import Iframe from 'react-iframe';
import { withStyles } from '@material-ui/core/styles';
import { styles } from '../_styles/TermsOfUse';

type Props = {
  classes: Record<string, any>;
};

type State = {};

class TermsOfUse extends React.PureComponent<Props, State> {
  state = {};

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Iframe
          url="https://circleinapp.s3.amazonaws.com/CircleIn+Terms+of+Use.html"
          id="myId"
          className={classes.iframe}
          position="relative"
        />
      </div>
    );
  }
}

export default withStyles(styles as any)(TermsOfUse);
