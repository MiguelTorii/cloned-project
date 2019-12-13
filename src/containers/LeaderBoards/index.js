import React, { useEffect } from 'react'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
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
  updateGrandLeaderboards
}) => {
  useEffect(() => {
    updateLeaderboards()
  }, [updateLeaderboards])

  return (
    <div style={{ width: '100%' }}>
      <Typography
        color="textPrimary"
        variant='h3'
        className={classes.title}
      >
        Leaderboards
      </Typography>
      <LeaderBoardTabs 
        leaderboard={leaderboard} 
        updateTuesdayLeaderboard={updateTuesdayLeaderboard}
        updateGrandLeaderboards={updateGrandLeaderboards}
      />
    </div>
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
      updateGrandLeaderboards: leaderboardActions.updateGrandLeaderboards
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(LeaderBoards));
