import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Profile, { PROFILE_PAGES } from '../../containers/Profile/Profile';
import withRoot from '../../withRoot';
import { useStyles } from './ProfileAreaStyles';
import { HudNavigationState } from '../../hud/navigationState/hudNavigationState';
import {
  ABOUT_ME_AREA,
  POINTS_HISTORY_AREA,
  REWARDS_STORE_AREA
} from '../../hud/navigationState/hudNavigation';
import Store from '../../containers/Store/Store';
import TransparentButton from '../../components/Basic/Buttons/TransparentButton';
import { signOut } from '../../actions/sign-in';
import { UserState } from '../../reducers/user';

const profilePathFormat = /^[/]profile[/]([^/]*)/;

const ProfileArea = () => {
  const dispatch = useDispatch();

  const classes: any = useStyles();

  const selectedMainArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.selectedMainArea
  );

  const selectedMainSubArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.selectedMainSubAreas[selectedMainArea]
  );

  const currentUserId: string = useSelector((state: { user: UserState }) => state.user.data.userId);

  const pathname: string = useSelector((state: any) => state.router.location.pathname);

  // TODO fixup source
  const source = '';
  let userId: string = currentUserId;
  let edit = true;

  const matchResult = pathname.match(profilePathFormat);
  const userIdFromPath = matchResult && matchResult[1];
  if (userIdFromPath) {
    userId = userIdFromPath;
    edit = false;
  }

  const handleSignOut = () => {
    dispatch(signOut());
  };

  return (
    <div className={classes.container}>
      <TransparentButton className={classes.signOut} onClick={handleSignOut}>
        Sign Out
      </TransparentButton>
      {selectedMainSubArea === ABOUT_ME_AREA && (
        <Profile
          key={`${userId}index`}
          userId={userId}
          edit={edit}
          from={source}
          defaultPage={PROFILE_PAGES.index}
        />
      )}

      {selectedMainSubArea === POINTS_HISTORY_AREA && (
        <Profile
          key={`${userId}history`}
          userId={userId}
          edit={edit}
          from={source}
          defaultPage={PROFILE_PAGES.points_history}
        />
      )}

      {selectedMainSubArea === REWARDS_STORE_AREA && <Store />}
    </div>
  );
};

export default withRoot(ProfileArea);
