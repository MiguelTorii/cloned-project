import React from 'react';

import { useSelector } from 'react-redux';

import LeaderBoards from 'containers/LeaderBoards/LeaderBoards';
import { LEADERBOARD_AREA } from 'hud/navigationState/hudNavigation';

import { useStyles } from './AchievementsAreaStyles';

import type { HudNavigationState } from 'hud/navigationState/hudNavigationState';

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
    <div id="achievements-scroll-container" className={classes.container}>
      {selectedMainSubArea === LEADERBOARD_AREA && <LeaderBoards />}
    </div>
  );
};

export default AchievementsArea;
