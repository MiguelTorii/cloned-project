// @flow
import React from 'react';
import Iframe from 'react-iframe';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iframe: {
    backgroundColor: 'white',
    width: '100%',
    height: 400,
    borderRadius: 15
  },
  actions: {
    width: '100%',
    marginTop: theme.spacing.unit * 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});

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
        <div className={classes.actions}>
          <Button variant="outlined" color="primary">
            Disagree
          </Button>
          <Button variant="contained" color="primary">
            Agree
          </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(TermsOfUse);
