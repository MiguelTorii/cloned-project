import React, { useState } from 'react';
import { withWidth } from '@material-ui/core';
import MainActionNavbar from '../navbar/HudNavbar';
import Profile, { PROFILE_PAGES } from '../../containers/Profile/Profile';
import withRoot from '../../withRoot';

type Props = {
  classes: Record<string, any>;
};

enum PROFILE_SECTIONS {
  'Profile',
  'PointsHistory'
}

const ProfileHudItem = ({ classes }: Props) => {
  const [currentGoalPage, setCurrentGoalPage] = useState<PROFILE_SECTIONS>(
    PROFILE_SECTIONS.Profile
  );

  const navbarItems = [
    {
      id: 'profile',
      displayName: 'Profile',
      onSelection: () => setCurrentGoalPage(PROFILE_SECTIONS.Profile)
    },
    {
      id: 'pointsHistory',
      displayName: 'Points History',
      onSelection: () => setCurrentGoalPage(PROFILE_SECTIONS.PointsHistory)
    }
  ];

  // TODO unhardcode
  const userId = '1041028';
  const source = '';
  const edit = true;

  return (
    <div className={classes.container}>
      <MainActionNavbar navbarItems={navbarItems} classes={classes} />

      {currentGoalPage === PROFILE_SECTIONS.Profile && (
        <Profile
          key={`${userId}index`}
          userId={userId}
          edit={edit}
          from={source}
          defaultPage={PROFILE_PAGES.index}
        />
      )}

      {currentGoalPage === PROFILE_SECTIONS.PointsHistory && (
        <Profile
          key={`${userId}history`}
          userId={userId}
          edit={edit}
          from={source}
          defaultPage={PROFILE_PAGES.points_history}
        />
      )}
    </div>
  );
};

export default withRoot(withWidth()(ProfileHudItem));
