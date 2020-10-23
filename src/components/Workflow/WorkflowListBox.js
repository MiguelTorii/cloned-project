import React from 'react'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import cx from 'classnames'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  details: {
    padding: 0
  },
  summary: {
    minHeight: theme.spacing(5),
    justifyContent: 'flex-start'
  },
  panel: {
    position: 'inherit',
    '& .MuiAccordionSummary-root': {
      borderBottom: `1px solid ${theme.circleIn.palette.borderColor}`,
      padding: 0,
      margin: theme.spacing(0, 3)
    },
    '& .MuiAccordionSummary-content': {
      margin: 0,
      flexGrow: 0
    },
  },
}))

const WorkflowListBox = ({ drop, name, tasks, list, isExpanded, onExpand }) => {
  const classes = useStyles()

  return (
    <Accordion
      ref={drop}
      elevation={0}
      className={cx(classes.panel)}
      expanded={isExpanded}
      onChange={onExpand}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />} className={classes.summary}>
        <Typography className={classes.header}>{name} ({tasks.length})</Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.details}>
        {list}
      </AccordionDetails>
    </Accordion>

  )
}

export default WorkflowListBox
