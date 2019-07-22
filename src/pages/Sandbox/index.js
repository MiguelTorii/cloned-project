/* eslint-disable jsx-a11y/mouse-events-have-key-events */

import React from 'react';
import { connect } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import withRoot from '../../withRoot';
import YourMonthCard from '../../components/YourMonthCard';
import DailyStreaksCard from '../../components/DailyStreaksCard';
import WeeklyStudyPackCard from '../../components/WeeklyStudyPackCard';
import QuestsCard from '../../components/QuestsCard';
import SeasonStatsCard from '../../components/SeasonStatsCard';
import RecommendedPostsCard from '../../components/RecommendedPostsCard';
import InviteYourFriendsCard from '../../components/InviteYourFriendsCard';

const styles = theme => ({
  main: {
    padding: theme.spacing.unit
  }
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
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <YourMonthCard />
          </Grid>
          <Grid item xs={6}>
            <DailyStreaksCard />
          </Grid>
          <Grid item xs={6}>
            <WeeklyStudyPackCard />
          </Grid>
          <Grid item xs={6}>
            <QuestsCard />
          </Grid>
          <Grid item xs={6}>
            <SeasonStatsCard />
          </Grid>
          <Grid item xs={6}>
            <RecommendedPostsCard />
          </Grid>
          <Grid item xs={6}>
            <InviteYourFriendsCard />
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
