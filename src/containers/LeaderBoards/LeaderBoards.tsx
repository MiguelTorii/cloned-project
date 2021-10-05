import React, { useState, useEffect } from 'react';
import { push } from 'connected-react-router';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { decypherClass } from '../../utils/crypto';
import type { State as StoreState } from '../../types/state';
import LeaderBoardTabs from '../../components/LeaderBoardTabs/LeaderBoardTabs';
import leaderboardActions from '../../actions/leaderboard';

type Props = {
  classes?: any;
  leaderboard?: any;
  userId?: any;
  updateLeaderboards?: any;
  updateTuesdayLeaderboard?: any;
  updateLeaderboardGrandInfo?: any;
  pushTo?: any;
  search?: any;
  classList?: any;
  updateGrandLeaderboards?: any;
};

const styles = (theme) => ({
  title: {
    marginTop: theme.spacing(4),
    fontWeight: 700,
    fontSize: 28
  }
});

const LeaderBoards = ({
  classes,
  leaderboard,
  userId,
  updateLeaderboards,
  updateTuesdayLeaderboard,
  updateLeaderboardGrandInfo,
  pushTo,
  search,
  classList,
  updateGrandLeaderboards
}: Props) => {
  const [courseDisplayName, setCourseDisplayname] = useState('');
  useEffect(() => {
    updateLeaderboards();
  }, [updateLeaderboards]);
  const { sectionId, classId } = decypherClass();

  const getCourseDisplayName = () => {
    if (classId && classList) {
      const c = classList.find((cl) => cl.classId === Number(classId));

      if (c) {
        return c.courseDisplayName;
      }
    }

    return '';
  };

  useEffect(() => {
    setCourseDisplayname(getCourseDisplayName()); // eslint-disable-next-line
  }, [classList, search]);
  return (
    <Grid xs={12} item>
      <Typography color="textPrimary" className={classes.title}>
        {courseDisplayName ? `${courseDisplayName} Leaderboards` : 'Leaderboards'}
      </Typography>
      <LeaderBoardTabs
        userId={userId}
        leaderboard={leaderboard}
        sectionId={sectionId}
        updateLeaderboardGrandInfo={updateLeaderboardGrandInfo}
        updateTuesdayLeaderboard={updateTuesdayLeaderboard}
        updateGrandLeaderboards={updateGrandLeaderboards}
        pushTo={pushTo}
      />
    </Grid>
  );
};

const mapStateToProps = ({ router, leaderboard, user }: StoreState): {} => ({
  leaderboard,
  router,
  search: router.location.search,
  classList: user.userClasses.classList,
  userId: user.data.userId
});

const mapDispatchToProps = (dispatch: any): {} =>
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

export default connect<{}, {}, Props>(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles as any)(LeaderBoards));
