/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useRef } from 'react';

import { differenceInMilliseconds } from 'date-fns';
import { useIdleTimer } from 'react-idle-timer';
import { useLocation } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';

import { Grid } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Hidden from '@material-ui/core/Hidden';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { POST_SOURCE } from 'constants/app';
import { TIMEOUT } from 'constants/common';

import { logEvent } from 'api/analytics';
import Recommendations from 'containers/Recommendations/Recommendations';
import { PROFILE_SOURCE_KEY } from 'routeConstants';

import { styles } from '../_styles/PostItem';
import RecommendationsFeedback from '../RecommendationsFeedback/RecommendationsFeedback';

const timeout = TIMEOUT.POST_ITEM;
const MyLink = React.forwardRef<any, any>(
  (
    { href, ...props },
    ref // eslint-disable-next-line react/destructuring-assignment
  ) => <RouterLink to={`/feed?id=${(props as any).feedid}`} {...props} ref={ref} />
);

type Props = {
  classes: Record<string, any>;
  children: React.ReactNode;
  feedId: number;
  isFlashcard?: boolean;
};

const PostItem = ({ classes, children, feedId, isFlashcard }: Props) => {
  const elapsed = useRef(0);
  const totalIdleTime = useRef(0);
  const remaining = useRef(timeout);
  const lastActive = useRef(+new Date());
  const location = useLocation();
  const from = useMemo(() => {
    const query = new URLSearchParams(location.search);
    return query.get(PROFILE_SOURCE_KEY);
  }, [location]);

  const handleOnActive = () => {
    const diff = differenceInMilliseconds(new Date(), lastActive.current);
    totalIdleTime.current = Math.max(totalIdleTime.current + diff - timeout, 0);
  };

  const { getRemainingTime, getLastActiveTime, getElapsedTime } = useIdleTimer({
    timeout,
    onActive: handleOnActive
  });
  useEffect(() => {
    remaining.current = getRemainingTime();
    lastActive.current = getLastActiveTime();
    elapsed.current = getElapsedTime();
    const timer = setInterval(() => {
      remaining.current = getRemainingTime();
      lastActive.current = getLastActiveTime();
      elapsed.current = getElapsedTime();
    }, 1000);
    return () => {
      clearInterval(timer);

      try {
        logEvent({
          event: 'Post- Viewed',
          props: {
            type: 'Viewed',
            feed_id: feedId,
            elapsed: elapsed.current,
            total_idle_time: totalIdleTime.current,
            effective_time: elapsed.current - totalIdleTime.current,
            platform: 'Web'
          }
        });
      } catch (err) {}
    };
  }, [feedId, getElapsedTime, getLastActiveTime, getRemainingTime, isFlashcard]);
  return (
    <div className={classes.container}>
      <Hidden smUp implementation="css">
        <div className={classes.actions}>
          <Typography className={classes.link}>
            <Link component={MyLink} feedid={feedId}>
              Back to Study
            </Link>
          </Typography>
        </div>
      </Hidden>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.root} elevation={0}>
            {children}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Box pt={2}>
            {from === POST_SOURCE.RECOMMENDATION && <RecommendationsFeedback feedId={feedId} />}
            <Recommendations />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default withStyles(styles as any)(PostItem);
