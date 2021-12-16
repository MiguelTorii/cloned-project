import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Profile, { PROFILE_PAGES } from '../../containers/Profile/Profile';
import { useStyles } from './ProfileAreaStyles';
import { HudNavigationState } from '../../hud/navigationState/hudNavigationState';
import {
  ABOUT_ME_AREA,
  GET_THE_MOBILE_APP_AREA,
  GIVE_FEEDBACK_AREA,
  POINTS_HISTORY_AREA
} from '../../hud/navigationState/hudNavigation';
import { UserState } from '../../reducers/user';
import AboutMeSubarea from '../aboutMe/AboutMeSubarea';
import { PROFILE_SOURCE_KEY } from '../../routeConstants';
import GiveFeedbackArea from './GiveFeedbackArea';
import GetMobileAppArea from './GetMobileAppArea';

const ProfileArea = () => {
  const classes: any = useStyles();

  const selectedMainArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.selectedMainArea
  );

  const selectedMainSubArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.selectedMainSubAreas[selectedMainArea]
  );

  const currentUserId: string = useSelector((state: { user: UserState }) => state.user.data.userId);

  const query: string = useSelector((state: any) => state.router.location.query);
  const from = query[PROFILE_SOURCE_KEY];

  const { userId } = useParams();
  const userIdFromPath = userId;

  const userIdToDisplay: string = userIdFromPath || currentUserId;
  const canEdit: boolean = userIdToDisplay === currentUserId;

  return (
    <div className={classes.profileAreaContainer}>
      {/* Even though this is not a loop, the key is required to make sure the profile renders correctly when the userId to show changes */}
      {selectedMainSubArea === ABOUT_ME_AREA && (
        <AboutMeSubarea
          key={userIdToDisplay}
          userIdToDisplay={userIdToDisplay}
          canEdit={canEdit}
          from={from}
        />
      )}

      {/* Even though this is not a loop, the key is required to make sure the profile renders correctly when the userId to show changes */}
      {selectedMainSubArea === POINTS_HISTORY_AREA && (
        <Profile
          key={userIdToDisplay}
          userId={userIdToDisplay}
          edit={canEdit}
          from={from}
          defaultPage={PROFILE_PAGES.points_history}
          isHud
        />
      )}

      {selectedMainSubArea === GIVE_FEEDBACK_AREA && <GiveFeedbackArea />}

      {selectedMainSubArea === GET_THE_MOBILE_APP_AREA && <GetMobileAppArea />}
    </div>
  );
};

export default ProfileArea;
