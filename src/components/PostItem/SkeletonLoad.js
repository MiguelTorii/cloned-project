import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    width: '100%'
  },
  skeletonLoad: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between'
  },
  skeletonComment: {
    width: '100%',
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(2)
  }
})

const SkeletonLoad = ({ classes }) => {
  return (
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
  )
}

export default withStyles(styles)(SkeletonLoad)
