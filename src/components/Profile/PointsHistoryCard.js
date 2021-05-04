import React, { useEffect, useMemo, useState } from 'react';
import type { UserProfile } from '../../types/models';
import { useDispatch, useSelector } from 'react-redux';
import withRoot from '../../withRoot';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import _ from 'lodash';
import PointsRecordItem from '../PointsRecordItem';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import GradientButton from '../Basic/Buttons/GradientButton';
import { getPointsHistory } from '../../actions/user';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useStyles } from '../_styles/Profile/PointsHistoryCard';

type Props = {
  profile: UserProfile,
  onSeeMore: Function
};

const PointsHistoryCard = ({ profile, onSeeMore }: Props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const myUserId = useSelector((state) => state.user.data.userId);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const title = useMemo(() => {
    return profile.userId === myUserId ?
      'Your Points History' :
      `${ _.capitalize(profile.firstName) } ${ _.capitalize(profile.lastName) }'s Points History`;
  }, [profile, myUserId]);

  useEffect(() => {
    setIsLoading(true);
    dispatch(
      getPointsHistory(
        profile.userId,
        0,
        3,
        (data) => {
          setIsLoading(false);
          setPointsHistory(data);
        }
      )
    );
  }, [profile, dispatch]);

  return (
    <Paper className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">
            { title }
          </Typography>
        </Grid>
        {
          pointsHistory.map((item, index) => (
            <Grid key={index} item xs={12}>
              <PointsRecordItem data={item}/>
            </Grid>
          ))
        }
        {
          isLoading &&
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" mt={3}>
                <CircularProgress />
              </Box>
            </Grid>
        }
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center">
            <GradientButton onClick={onSeeMore}>
              See more
            </GradientButton>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default withRoot(PointsHistoryCard);
