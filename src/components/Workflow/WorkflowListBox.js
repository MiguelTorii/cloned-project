import React from 'react'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import cx from 'classnames'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  details: {
    padding: 0
  },
  panel: {
    position: 'inherit',
    '& .MuiExpansionPanelSummary-root': {
      borderBottom: `1px solid ${theme.circleIn.palette.borderColor}`,
      padding: 0,
      margin: theme.spacing(0, 3)
    },
    '& .MuiButtonBase-root': {
      minHeight: theme.spacing(5),
      justifyContent: 'flex-start'
    },
    '& .MuiExpansionPanelSummary-content': {
      margin: 0,
      flexGrow: 0
    },
  },
}))

const WorkflowListBox = ({ drop, name, tasks, list, isExpanded, onExpand }) => {
  const classes = useStyles()

  return (
    <ExpansionPanel
      ref={drop}
      elevation={0}
      className={cx(classes.panel)}
      expanded={isExpanded}
      onChange={onExpand}
    >
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.header}>{name} ({tasks.length})</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.details}>
        {list}
      </ExpansionPanelDetails>
    </ExpansionPanel>

  )
}

export default WorkflowListBox
