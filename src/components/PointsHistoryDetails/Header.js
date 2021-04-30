import React from 'react';
import type { UserProfile } from '../../types/models';
import withRoot from '../../withRoot';
import { makeStyles, Grid, Typography, Paper, useMediaQuery } from '@material-ui/core';
import Avatar from '../Avatar';
import { avatarTextFromName, getPointsText } from '../../utils/helpers';
import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3)
  },
  mainContainer: {
    justifyContent: 'flex-start',
    [theme.breakpoints.up('md')]: {
      justifyContent: 'space-between'
    }
  },
  textAlign: {
    textAlign: 'right',
    [theme.breakpoints.down('sm')]: {
      textAlign: 'left'
    }
  },
  subtext: {
    fontWeight: 700,
    [theme.breakpoints.up('md')]: {
      color: '#5F6165'
    }
  }
}));

type Props = {
  profile: UserProfile
};

const Header = ({ profile }: Props) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper className={classes.root}>
      <Grid container spacing={2} className={classes.mainContainer} alignItems="center">
        <Grid item xs={12} md={6} wrap="nowrap" container spacing={2} alignItems="center">
          <Grid item>
            <Avatar
              src={profile.userProfileUrl}
              defaultText={avatarTextFromName(`${profile.firstName} ${profile.lastName}`)}
            />
          </Grid>
          <Grid item container direction="column" spacing={isMobile ? 0 : 1}>
            <Grid item>
              <Typography variant="h5">
                { `${profile.firstName} ${profile.lastName}` }
              </Typography>
            </Grid>
            {/*<Grid item container spacing={2}>*/}
            {/*  <Grid item>*/}
            {/*    <Typography>*/}
            {/*      24*/}
            {/*    </Typography>*/}
            {/*  </Grid>*/}
            {/*  <Grid item>*/}
            {/*    <Typography>*/}
            {/*      16*/}
            {/*    </Typography>*/}
            {/*  </Grid>*/}
            {/*</Grid>*/}
            <Grid item>
              <Typography>
                Rank: #{profile.rank}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} container spacing={2}>
          <Grid item xs={6} md={12}>
            <Typography variant="h5" className={classes.textAlign}>
              { getPointsText(profile.points) } Points
            </Typography>
            <Typography variant="body2" className={clsx(classes.subtext, classes.textAlign)}>
              Total
            </Typography>
          </Grid>
          {/*<Grid item xs={6} md={12}>*/}
          {/*  <Typography variant="h5" className={classes.textAlign}>*/}
          {/*    + 20K Points*/}
          {/*  </Typography>*/}
          {/*  <Typography variant="body2" className={clsx(classes.subtext, classes.textAlign)}>*/}
          {/*    From Today*/}
          {/*  </Typography>*/}
          {/*</Grid>*/}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default withRoot(Header);
