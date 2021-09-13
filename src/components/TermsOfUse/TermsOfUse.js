// @flow
import React from 'react';
import Iframe from 'react-iframe';
import { withStyles } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';
import { styles } from '../_styles/TermsOfUse';

type Props = {
  classes: Object
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
          display="initial"
          position="relative"
        />
        {/* <div className={classes.actions}>
          <Button variant="outlined" color="primary">
            Disagree
          </Button>
          <Button variant="contained" color="primary">
            Agree
          </Button>
        </div> */}
      </div>
    );
  }
}

export default withStyles(styles)(TermsOfUse);
