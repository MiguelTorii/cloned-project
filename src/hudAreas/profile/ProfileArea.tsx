import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Profile, { PROFILE_PAGES } from '../../containers/Profile/Profile';
import withRoot from '../../withRoot';
import { useStyles } from './ProfileAreaStyles';
import { HudNavigationState } from '../../hud/navigationState/hudNavigationState';
import { ABOUT_ME_AREA, POINTS_HISTORY_AREA } from '../../hud/navigationState/hudNavigation';
import TransparentButton from '../../components/Basic/Buttons/TransparentButton';
import { signOut } from '../../actions/sign-in';

const ProfileArea = (s) => {
  const dispatch = useDispatch();
  const classes: any = useStyles();

  const selectedMainArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.selectedMainArea
  );

  const selectedMainSubArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.selectedMainSubAreas[selectedMainArea]
  );

  const handleSignOut = () => {
    dispatch(signOut());
  };

  // TODO unhardcode
  const userId = '1041028';
  const source = '';
  const edit = true;

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
    </div>
  );
};

export default withRoot(ProfileArea);
