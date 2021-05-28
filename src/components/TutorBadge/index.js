import React, { useMemo } from 'react'
import Proptypes from 'prop-types'
import Chip from '@material-ui/core/Chip'
import { withStyles } from '@material-ui/core/styles';
import { MEMBER_ROLES } from 'constants/app'
import styles from '../_styles/TutorBadge';

const TutorBadge = ({ text, classes }) => {
  const tutorBadgeBgColor = useMemo(() => {
    switch (text) {
    case MEMBER_ROLES.TUTOR:
      return classes.tutorBackground
    case MEMBER_ROLES.ORIENTATION_LEADER:
      return classes.leaderBackground
    case MEMBER_ROLES.EXPERT:
      return classes.expertBackground
    default:
      return classes.colorPrimary
    }
  }, [text, classes])

  return (
    <Chip
      size='small'
      color='primary'
      label={text}
      classes={{
        root: classes.root,
        labelSmall: classes.labelSmall,
        sizeSmall: classes.sizeSmall,
        colorPrimary: tutorBadgeBgColor
      }}
    />
  )
}

TutorBadge.propTypes = {
  text: Proptypes.string.isRequired,
  // eslint-disable-next-line
  classes: Proptypes.object.isRequired
}

export default withStyles(styles)(TutorBadge)

