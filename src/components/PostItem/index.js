/* eslint-disable jsx-a11y/anchor-is-valid */
// @flow
import React, { useEffect, useRef } from 'react';
import type { Node } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { differenceInMilliseconds } from "date-fns";
import { useIdleTimer } from "react-idle-timer";
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Hidden from '@material-ui/core/Hidden';
import { logEvent } from '../../api/analytics';
import { styles } from '../_styles/PostItem';
import { TIMEOUT } from 'constants/common';

const timeout = TIMEOUT.POST_ITEM;

const MyLink = React.forwardRef(({ href, ...props }, ref) =>
  // eslint-disable-next-line react/destructuring-assignment
  <RouterLink to={`/feed?id=${props.feedid}`} {...props} ref={ref} />);

type Props = {
  classes: Object,
  children: Node,
  feedId: number
};

const PostItem = ({
  classes,
  children,
  feedId,
  isFlashcard,
}: Props) => {

  const elapsed = useRef(0);
  const totalIdleTime = useRef(0);
  const remaining = useRef(timeout);
  const lastActive = useRef(+new Date());

  const handleOnActive = () => {
    const diff = differenceInMilliseconds(new Date(), lastActive.current);
    totalIdleTime.current = Math.max(totalIdleTime.current + diff - timeout, 0);
  };

  const {
    getRemainingTime,
    getLastActiveTime,
    getElapsedTime
  } = useIdleTimer({
    timeout,
    onActive: handleOnActive,
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
        !isFlashcard && logEvent({
          event: 'Post- Viewed',
          props: {
            type: 'Viewed',
            feed_id: feedId,
            elapsed: elapsed.current,
            total_idle_time: totalIdleTime.current,
            effective_time: elapsed.current - totalIdleTime.current,
            platform: 'Web',
          }
        });
      } catch (err) {}
    }
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
      <Paper className={classes.root} elevation={0}>
        {children}
      </Paper>
    </div>
  );
}

export default withStyles(styles)(PostItem);
