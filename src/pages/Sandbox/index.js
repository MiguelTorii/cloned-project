/* eslint-disable jsx-a11y/mouse-events-have-key-events */

import React from 'react';
import { connect } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import withRoot from '../../withRoot';
import YourMonthCard from '../../components/YourMonthCard';
import DailyStreaksCard from '../../components/DailyStreaksCard';

const styles = () => ({
  main: {}
});

type Props = {
  classes: Object
};

type State = {};

class Sandbox extends React.Component<Props, State> {
  state = {};

  render() {
    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <YourMonthCard />
          </Grid>
          <Grid item xs={6}>
            <DailyStreaksCard />
          </Grid>
        </Grid>
      </main>
    );
  }
}

export default withRoot(
  connect(
    null,
    null
  )(withStyles(styles)(Sandbox))
);
