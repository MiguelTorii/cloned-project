import React, { useState } from 'react';
import { withWidth } from '@material-ui/core';
import MainActionNavbar from '../navbar/HudNavbar';
import Store from '../../containers/Store/Store';
import LeaderBoards from '../../containers/LeaderBoards/LeaderBoards';
import WeeklyGoals from '../../containers/WeeklyGoals/WeeklyGoals';
import withRoot from '../../withRoot';

type Props = {
  classes: Record<string, any>;
};

enum GOAL_SECTIONS {
  'Goals',
  'Rewards',
  'LeaderBoard'
}

const GoalsHudItem = ({ classes }: Props) => {
  const [currentGoalPage, setCurrentGoalPage] = useState<GOAL_SECTIONS>(GOAL_SECTIONS.Goals);

  const navbarItems = [
    {
      id: 'goals',
      displayName: 'Goals',
      onSelection: () => setCurrentGoalPage(GOAL_SECTIONS.Goals)
    },
    {
      id: 'rewards',
      displayName: 'Rewards',
      onSelection: () => setCurrentGoalPage(GOAL_SECTIONS.Rewards)
    },
    {
      id: 'leaderboard',
      displayName: 'LeaderBoard',
      onSelection: () => setCurrentGoalPage(GOAL_SECTIONS.LeaderBoard)
    }
  ];

  return (
    <div className={classes.container}>
      <MainActionNavbar navbarItems={navbarItems} classes={classes} />

      {currentGoalPage === GOAL_SECTIONS.Goals && <WeeklyGoals />}

      {currentGoalPage === GOAL_SECTIONS.Rewards && <Store />}

      {currentGoalPage === GOAL_SECTIONS.LeaderBoard && <LeaderBoards />}
    </div>
  );
};

export default withRoot(withWidth()(GoalsHudItem));
