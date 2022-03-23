import React from 'react';

import clsx from 'clsx';

import { Grid, Typography, Paper, useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

import { getPointsText } from 'utils/helpers';

import Avatar from 'components/Avatar';
import withRoot from 'withRoot';

import { useStyles } from '../_styles/PointsHistoryDetails/Header';

import type { UserProfile } from 'types/models';

type Props = {
  profile: UserProfile;
};

const Header = ({ profile }: Props) => {
  const classes: any = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <Paper className={classes.root}>
      <Grid container spacing={2} className={classes.mainContainer} alignItems="center">
        <Grid item xs={12} md={6} wrap="nowrap" container spacing={2} alignItems="center">
          <Grid item>
            <Avatar
              profileImage={profile.userProfileUrl}
              fullName={fullName}
              desktopSize={124}
              mobileSize={60}
            />
          </Grid>
          <Grid item container direction="column" spacing={isMobile ? 0 : 1}>
            <Grid item>
              <Typography variant="h5">{`${profile.firstName} ${profile.lastName}`}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} container spacing={2}>
          <Grid item xs={6} md={12}>
            <Typography variant="h5" className={classes.textAlign}>
              {getPointsText(profile.points)} Points
            </Typography>
            <Typography variant="body2" className={clsx(classes.subtext, classes.textAlign)}>
              Total
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default withRoot(Header);
