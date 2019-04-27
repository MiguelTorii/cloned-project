// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import HomeGridList from '../../components/HomeGridList';

const styles = () => ({});

type Props = {
  classes: Object
};

type State = {};

class HomeGrid extends React.PureComponent<Props, State> {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <HomeGridList />
      </div>
    );
  }
}

export default withStyles(styles)(HomeGrid);
