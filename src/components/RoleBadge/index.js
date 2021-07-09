/* eslint-disable react/forbid-prop-types */
import React from 'react'
import Proptypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'
import { ReactComponent as BadgeVector } from 'assets/svg/badge_vector.svg'
import styles from '../_styles/RoleBadge';

const RoleBadge = ({ text, classes }) => {
  return (
    <Chip
      size='small'
      color='primary'
      icon={<BadgeVector />}
      label={text}
      classes={{
        root: text ? classes.root : classes.vectorBadgeRoot,
        label: !text && classes.label,
        labelSmall: classes.labelSmall,
        sizeSmall: classes.sizeSmall,
        colorPrimary: classes.userRoleColor,
        iconSmall: !text && classes.iconSmall
      }}
    />
  )
}

RoleBadge.propTypes = {
  classes: Proptypes.object.isRequired
}

export default withStyles(styles)(RoleBadge)

