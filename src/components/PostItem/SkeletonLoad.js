import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import { withStyles } from '@material-ui/core/styles';

import { styles } from '../_styles/PostItem/SkeletonLoad';

const SkeletonLoad = ({ classes }) => (
  <div className={classes.root}>
    <SkeletonTheme color="#202020" highlightColor="#444">
      <div className={classes.skeletonLoad}>
        <Skeleton circle height={50} width={50} />
        <div className={classes.skeletonComment}>
          <Skeleton height={100} />
        </div>
      </div>
    </SkeletonTheme>
  </div>
);

export default withStyles(styles)(SkeletonLoad);
