import React from 'react';
import { Box } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import { ChevronLeft } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import type { UserProfile } from '../../types/models';
import withRoot from '../../withRoot';
import Header from './Header';
import PointsHistory from './PointsHistory';
import { CampaignState } from '../../reducers/campaign';

type Props = {
  profile: UserProfile;
  isMyProfile: boolean;
  onGoBack: (...args: Array<any>) => any;
};

const PointsHistoryDetails = ({ profile, onGoBack, isMyProfile }: Props) => {
  const isHud: boolean | null = useSelector(
    (state: { campaign: CampaignState }) => state.campaign.hud
  );

  return (
    <div>
      {!isHud && (
        <Link component="button" color="inherit" variant="body1" onClick={onGoBack}>
          <Box display="flex" alignItems="center" mb={3}>
            <ChevronLeft />
            {isMyProfile && isHud
              ? 'Back to Profile'
              : `${profile.firstName} ${profile.lastName}'s Profile`}
          </Box>
        </Link>
      )}
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
