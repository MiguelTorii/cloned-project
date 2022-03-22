import React from 'react';
import Grid from '@material-ui/core/Grid';
import type { UserProfile } from '../../types/models';
import withRoot from '../../withRoot';
import Header from './Header';
import PointsHistory from './PointsHistory';

type Props = {
  profile: UserProfile;
  isMyProfile: boolean;
};

const PointsHistoryDetails = ({ profile, isMyProfile }: Props) => {
  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={12}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Header profile={profile} />
            </Grid>
            <Grid item xs={12}>
              <PointsHistory
                userId={profile.userId}
                isMyProfile={isMyProfile}
                displayName={profile.firstName}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default withRoot(PointsHistoryDetails);
