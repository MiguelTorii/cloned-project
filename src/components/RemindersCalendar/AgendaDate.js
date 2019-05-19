/* eslint-disable jsx-a11y/anchor-is-valid */
// @flow

import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = () => ({
  main: {}
});

type Props = {
  classes: Object
};

type State = {};

class AgendaDate extends React.PureComponent<Props, State> {
  static navigate = (date, action) => {
    console.log(action);
    return date;
  };

  static title = date => {
    return `${date.toLocaleDateString()}`;
  };

  render() {
    const { classes } = this.props;
    console.log(this.props);

    return <main className={classes.main}>date</main>;
  }
}

export default withStyles(styles)(AgendaDate);
