import React from 'react'
import Proptypes from 'prop-types'
import Chip from '@material-ui/core/Chip'
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    marginLeft: theme.spacing()
  },
  colorPrimary: {
    backgroundColor: '#FFE89B',
    color: theme.circleIn.palette.normalButtonText1,
    fontWeight: 900,
    padding: 0,
    borderRadius: 4
  },
  labelSmall: {
    padding: 0,
    paddingLeft: theme.spacing(),
    paddingRight: theme.spacing(),
  },
  sizeSmall: {
    height: 16,
    fontSize: 14
  }
})

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

