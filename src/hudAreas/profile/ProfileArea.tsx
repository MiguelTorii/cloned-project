import React, { useState } from 'react';
import HudToolbar from '../../hud/navigation/HudToolbar';
import Profile, { PROFILE_PAGES } from '../../containers/Profile/Profile';
import withRoot from '../../withRoot';
import { useStyles } from './ProfileAreaStyles';

const PROFILE_NAV_ITEM_ID = 'profile';
const POINTS_HISTORY_NAV_ITEM_ID = 'pointsHistory';

const ProfileArea = (s) => {
  const classes: any = useStyles();

  const navbarItems = [
    {
      id: PROFILE_NAV_ITEM_ID,
      displayName: 'Profile'
    },
    {
      id: POINTS_HISTORY_NAV_ITEM_ID,
      displayName: 'Points History'
    }
  ];

  const [currentNavbarItemId, setCurrentNavbarItemId] = useState<string>(navbarItems[0].id);

  // TODO unhardcode
  const userId = '1041028';
  const source = '';
  const edit = true;

  return (
    <div className={classes.container}>
      <HudToolbar onSelectItem={setCurrentNavbarItemId} navbarItems={navbarItems} />

      {currentNavbarItemId === PROFILE_NAV_ITEM_ID && (
        <Profile
          key={`${userId}index`}
          userId={userId}
          edit={edit}
          from={source}
          defaultPage={PROFILE_PAGES.index}
        />
      )}

      {currentNavbarItemId === POINTS_HISTORY_NAV_ITEM_ID && (
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

export default withRoot(ProfileArea);
