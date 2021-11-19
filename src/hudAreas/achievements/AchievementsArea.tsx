import React from 'react';
import { useSelector } from 'react-redux';
import LeaderBoards from '../../containers/LeaderBoards/LeaderBoards';
import WeeklyGoals from '../../containers/WeeklyGoals/WeeklyGoals';
import { useStyles } from './AchievementsAreaStyles';
import {
  REWARDS_STORE_AREA,
  GOALS_AREA,
  LEADERBOARD_AREA,
  SCHOLARSHIPS_AREA
} from '../../hud/navigationState/hudNavigation';
import { HudNavigationState } from '../../hud/navigationState/hudNavigationState';
import Store from '../../containers/Store/Store';

const AchievementsArea = () => {
  const classes: any = useStyles();

  const selectedMainArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.selectedMainArea
  );

  const selectedMainSubArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.selectedMainSubAreas[selectedMainArea]
  );

  return (
    <div className={classes.container}>
      {selectedMainSubArea === GOALS_AREA && <WeeklyGoals />}

      {selectedMainSubArea === REWARDS_STORE_AREA && <Store />}

      {selectedMainSubArea === LEADERBOARD_AREA && <LeaderBoards />}

      {selectedMainSubArea === SCHOLARSHIPS_AREA && <div>SCHOLARSHIPS COMING SOON</div>}
    </div>
  );
};

export default AchievementsArea;
