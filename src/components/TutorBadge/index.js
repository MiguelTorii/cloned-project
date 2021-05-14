import React from 'react'
import Proptypes from 'prop-types'
import Chip from '@material-ui/core/Chip'
import { withStyles } from '@material-ui/core/styles';
import styles from '../_styles/TutorBadge';

const TutorBadge = ({ text, classes }) => (
  <Chip
    size='small'
    color='primary'
    label={text}
    classes={{
      root: classes.root,
      labelSmall: classes.labelSmall,
      sizeSmall: classes.sizeSmall,
      colorPrimary: classes.colorPrimary
    }}
  />
)

TutorBadge.propTypes = {
  text: Proptypes.string.isRequired,
  // eslint-disable-next-line
  classes: Proptypes.object.isRequired
}

export default withStyles(styles)(TutorBadge)

