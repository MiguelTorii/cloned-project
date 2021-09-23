// @flow

import React, { useEffect, useState } from 'react';
import withRoot from 'withRoot';
import { Hidden, Paper, Typography, Box, Grid, CircularProgress } from '@material-ui/core';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import update from 'immutability-helper';
import { getPointsHistory } from 'actions/user';
import { isApiCalling } from 'utils/helpers';
import { userActions } from 'constants/action-types';
import GradientButton from '../Basic/Buttons/GradientButton';
import PointsRecordItem from '../PointsRecordItem/PointsRecordItem';

import { useStyles } from '../_styles/PointsHistoryDetails/PointsHistory';

type Props = {
  userId: number,
  isMyProfile: boolean,
  displayName: string
};

const UNITS_LOADING = 5;

const PointsHistory = ({ userId, isMyProfile, displayName }: Props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const isLoadingData = useSelector(isApiCalling(userActions.GET_POINTS_HISTORY));

  const fetchRecords = (count) => {
    dispatch(
      getPointsHistory(userId, records.length, count, (points_history) => {
        setRecords(
          update(records, {
            $push: points_history
          })
        );
        setHasMore(points_history.length === count);
      })
    );
  };

  useEffect(() => {
    fetchRecords(10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderRecords = (isMobile) => (
    <Grid container spacing={isMobile ? 2 : 3}>
      {records.map((record, index) => (
        <Grid key={index} item xs={12}>
          <PointsRecordItem data={record} />
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Paper className={classes.root}>
      <Typography variant="h6" paragraph>
        {isMyProfile ? 'Your' : `${displayName}'s`} Points History
      </Typography>
      <Hidden smDown>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography>Activity</Typography>
          <Typography>Points Earned</Typography>
        </Box>
        <InfiniteScroll
          className={classes.scroller}
          next={() => fetchRecords(UNITS_LOADING)}
          hasMore={hasMore}
          loader={
            <Box display="flex" justifyContent="center" mt={2} pt={2}>
              <CircularProgress />
            </Box>
          }
          dataLength={records.length}
        >
          {renderRecords(false)}
        </InfiniteScroll>
      </Hidden>
      <Hidden mdUp>
        {renderRecords(true)}
        <Box display="flex" justifyContent="center" mt={2}>
          <GradientButton
            loading={isLoadingData}
            disabled={isLoadingData}
            onClick={() => fetchRecords(UNITS_LOADING)}
          >
            See More
          </GradientButton>
        </Box>
      </Hidden>
    </Paper>
  );
};

export default withRoot(PointsHistory);
