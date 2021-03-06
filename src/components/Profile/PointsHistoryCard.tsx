import React, { useEffect, useMemo, useState } from 'react';

import capitalize from 'lodash/capitalize';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { getPointsHistory } from 'actions/user';
import withRoot from 'withRoot';

import { useStyles } from '../_styles/Profile/PointsHistoryCard';
import GradientButton from '../Basic/Buttons/GradientButton';
import PointsRecordItem from '../PointsRecordItem/PointsRecordItem';

import type { UserState } from 'reducers/user';
import type { UserProfile } from 'types/models';

type Props = {
  profile: UserProfile;
  onSeeMore: (...args: Array<any>) => any;
};

const PointsHistoryCard = ({ profile, onSeeMore }: Props) => {
  const classes: any = useStyles();
  const dispatch = useDispatch();
  const myUserId = useSelector((state: { user: UserState }) => state.user.data.userId);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const title = useMemo(
    () =>
      profile.userId === myUserId
        ? 'Your Points History'
        : `${capitalize(profile.firstName)} ${capitalize(profile.lastName)}'s Points History`,
    [profile, myUserId]
  );
  useEffect(() => {
    setIsLoading(true);
    dispatch(
      getPointsHistory(profile.userId, 0, 3, (data) => {
        setIsLoading(false);
        setPointsHistory(data);
      })
    );
  }, [profile.userId, dispatch]);
  return (
    <Paper className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">{title}</Typography>
        </Grid>
        {pointsHistory.map((item, index) => (
          <Grid key={index} item xs={12}>
            <PointsRecordItem data={item} />
          </Grid>
        ))}
        {isLoading && (
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" mt={3}>
              <CircularProgress />
            </Box>
          </Grid>
        )}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center">
            <GradientButton onClick={onSeeMore}>See more</GradientButton>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default withRoot(PointsHistoryCard);
