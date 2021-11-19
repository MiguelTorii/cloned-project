import React from 'react';
import { useSelector } from 'react-redux';
import LeaderBoards from '../../containers/LeaderBoards/LeaderBoards';
import WeeklyGoals from '../../containers/WeeklyGoals/WeeklyGoals';
import { useStyles } from './AchievementsAreaStyles';
import {
  BADGES_AREA,
  GOALS_AREA,
  LEADERBOARD_AREA,
  SCHOLARSHIPS_AREA
} from '../../hud/navigationState/hudNavigation';
import { HudNavigationState } from '../../hud/navigationState/hudNavigationState';

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

      {selectedMainSubArea === BADGES_AREA && <div>BADGES COMING SOON</div>}

      {selectedMainSubArea === LEADERBOARD_AREA && <LeaderBoards />}

      {selectedMainSubArea === SCHOLARSHIPS_AREA && <div>SCHOLARSHIPS COMING SOON</div>}
    </div>
  );
};

export default AchievementsArea;
