/* eslint-disable jsx-a11y/anchor-is-valid */
// @flow

import React from 'react';
import type { Node } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = () => ({
  main: {
    // display: 'flex',
    // width: '100%',
    // alignItems: 'center',
    // justifyContent: 'flex-end'
  }
});

type Props = {
  classes: Object,
  children: Node
};

type State = {};

class EventWrapper extends React.PureComponent<Props, State> {
  render() {
    const { classes, children } = this.props;

    return <main className={classes.main}>{children}</main>;
  }
}

export default withStyles(styles)(EventWrapper);
