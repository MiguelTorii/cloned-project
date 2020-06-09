// @flow
import React, { useMemo, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import WorkflowItem from 'components/Workflow/WorkflowItem'
import List from '@material-ui/core/List'
import { useDrop } from 'react-dnd'

const useStyles = makeStyles(theme => ({
  header: {
    fontWeight: 'bold',
    fontSize: 20
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
  list: {
    width: '100%',
    '& .MuiDivider-root': {
      display: 'none'
    }
  },
  details: {
    padding: 0
  }
}))

const WorkflowBox = ({
  handleExpand,
  archiveTask,
  tasks,
  categoryId,
  updateItem,
  classList,
  expanded,
  moveTask,
  updateCategory,
  name,
  onDrag,
  dragId
}) => {
  const classes = useStyles()
  const [, drop] = useDrop({
    accept: 'task',
    drop: () => ({ categoryId }),
    hover(item, monitor) {
      if(monitor.isOver()) {
        if (categoryId !== item.categoryId) {
          handleExpand(categoryId)(true)
          updateCategory(item.index, categoryId)
          // eslint-disable-next-line
          item.categoryId = categoryId
        }
      }
    }
  })

  const isExpanded = useMemo(() => expanded[categoryId-1], [categoryId, expanded])
  const onExpand = useCallback(
    () => handleExpand(categoryId)(!isExpanded),
    [handleExpand, categoryId, isExpanded])

  return (
    <ExpansionPanel
      ref={drop}
      elevation={0}
      className={classes.panel}
      expanded={isExpanded}
      onChange={onExpand}
    >
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.header}>{name} ({tasks.length})</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.details}>
        <List className={classes.list}>
          {tasks.map(t => (
            <WorkflowItem
              classList={classList}
              index={t.index}
              dragId={dragId}
              onDrag={onDrag}
              key={t.id}
              task={t}
              archiveTask={archiveTask}
              updateItem={updateItem}
              moveTask={moveTask}
            />
          ))}
        </List>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

export default WorkflowBox
