import React, { useState } from 'react';
import Store from '../../containers/Store/Store';
import LeaderBoards from '../../containers/LeaderBoards/LeaderBoards';
import WeeklyGoals from '../../containers/WeeklyGoals/WeeklyGoals';
import HudToolbar from '../../hud/navigation/HudToolbar';
import { useStyles } from './AchievementsAreaStyles';

const GOALS_NAV_ITEM_ID = 'classes';
const REWARDS_NAV_ITEM_ID = 'feeds';
const LEADER_BOARD_NAV_ITEM_ID = 'leaderBoard';

const AchievementsArea = () => {
  const classes: any = useStyles();

  const navbarItems = [
    {
      id: GOALS_NAV_ITEM_ID,
      displayName: 'Goals'
    },
    {
      id: REWARDS_NAV_ITEM_ID,
      displayName: 'Rewards'
    },
    {
      id: LEADER_BOARD_NAV_ITEM_ID,
      displayName: 'LeaderBoard'
    }
  ];

  const [currentNavbarItemId, setCurrentNavbarItemId] = useState<string>(navbarItems[0].id);

  return (
    <div className={classes.container}>
      <HudToolbar onSelectItem={setCurrentNavbarItemId} navbarItems={navbarItems} />

      {currentNavbarItemId === GOALS_NAV_ITEM_ID && <WeeklyGoals />}

      {currentNavbarItemId === REWARDS_NAV_ITEM_ID && <Store />}

      {currentNavbarItemId === LEADER_BOARD_NAV_ITEM_ID && <LeaderBoards />}
    </div>
  );
};

export default AchievementsArea;
