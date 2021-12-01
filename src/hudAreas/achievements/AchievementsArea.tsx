import React from 'react';
import { useSelector } from 'react-redux';
import LeaderBoards from '../../containers/LeaderBoards/LeaderBoards';
import { useStyles } from './AchievementsAreaStyles';
import { LEADERBOARD_AREA } from '../../hud/navigationState/hudNavigation';
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
      {selectedMainSubArea === LEADERBOARD_AREA && <LeaderBoards />}
    </div>
  );
};

export default AchievementsArea;
