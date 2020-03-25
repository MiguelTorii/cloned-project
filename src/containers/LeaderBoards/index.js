import React, { useEffect } from 'react'
import { push } from 'connected-react-router';
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import type { State as StoreState } from '../../types/state';
import LeaderBoardTabs from '../../components/LeaderBoardTabs'
import leaderboardActions from '../../actions/leaderboard'

const styles = () => ({
  title: {
    marginTop: 32
  }
})

const LeaderBoards = ({ 
  classes, 
  leaderboard, 
  updateLeaderboards,
  updateTuesdayLeaderboard,
  updateLeaderboardGrandInfo,
  pushTo,
  sectionId,
  updateGrandLeaderboards
}) => {
  useEffect(() => {
    updateLeaderboards()
  }, [updateLeaderboards])

  return (
    <Grid xs={12} item>
      <Typography
        color="textPrimary"
        variant='h3'
        className={classes.title}
      >
        Leaderboards
      </Typography>
      <LeaderBoardTabs 
        leaderboard={leaderboard}
        sectionId={sectionId}
        updateLeaderboardGrandInfo={updateLeaderboardGrandInfo}
        updateTuesdayLeaderboard={updateTuesdayLeaderboard}
        updateGrandLeaderboards={updateGrandLeaderboards}
        pushTo={pushTo}
      />
    </Grid>
  )
}

const mapStateToProps = ({ leaderboard }: StoreState): {} => ({
  leaderboard
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      updateLeaderboards: leaderboardActions.updateLeaderboards,
      updateTuesdayLeaderboard: leaderboardActions.updateTuesdayLeaderboard,
      updateGrandLeaderboards: leaderboardActions.updateGrandLeaderboards,
      updateLeaderboardGrandInfo: leaderboardActions.updateLeaderboardGrandInfo,
      pushTo: push
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(LeaderBoards));
