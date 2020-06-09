// @flow
import React, { useMemo } from 'react'
import WorkflowBox from 'components/Workflow/WorkflowBox'
import DragPreview from 'components/Workflow/DragPreview'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles(theme => ({
  item: {
    paddingLeft: theme.spacing(3)+48,
    paddingRight: theme.spacing(14),
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  headerText: {
    color: theme.circleIn.palette.primaryText2,
    textAlign: 'center'
  },
  classText: {
    color: theme.circleIn.palette.primaryText2,
  }
}))

type Props = {
  archiveTask: Function,
  classList: array,
  updateItem: Function,
  moveTask: Function,
  updateCategory: Function,
  tasks: array,
  dragId: number,
  onDrag: Function,
  expanded: array,
  handleExpand: Function
};

const WorkflowList = ({
  dragId,
  onDrag,
  updateCategory,
  moveTask,
  classList,
  tasks,
  expanded,
  handleExpand,
  archiveTask,
  updateItem
}: Props) => {
  const indexed = useMemo(() => tasks.map((t, index) => ({ ...t, index})), [tasks])
  const upcoming = useMemo(() => indexed.filter(t => t.categoryId === 1), [indexed])
  const inprogress = useMemo(() => indexed.filter(t => t.categoryId === 2), [indexed])
  const ready = useMemo(() => indexed.filter(t => t.categoryId === 3), [indexed])
  const done = useMemo(() => indexed.filter(t => t.categoryId === 4), [indexed])
  const classes = useStyles()

  const boxes = [
    { name: 'Upcoming', tasks: upcoming, categoryId: 1 },
    { name: 'In Progress', tasks: inprogress, categoryId: 2 },
    { name: 'Ready to Submit', tasks: ready, categoryId: 3 },
    { name: 'Done', tasks: done, categoryId: 4 }
  ]

  return (
    <div>
      <DragPreview />
      <div className={classes.item}>
        <Grid container alignItems='center'>
          <Grid item xs={6} />
          <Grid item xs={2} className={classes.headerText}>
            Due Date
          </Grid>
          <Grid item xs={4} className={classes.classText}>
            Class
          </Grid>
        </Grid>
      </div>
      {boxes.map(box => (
        <WorkflowBox
          archiveTask={archiveTask}
          dragId={dragId}
          onDrag={onDrag}
          updateCategory={updateCategory}
          key={box.name}
          tasks={box.tasks}
          categoryId={box.categoryId}
          classList={classList}
          moveTask={moveTask}
          updateItem={updateItem}
          expanded={expanded}
          name={box.name}
          handleExpand={handleExpand}
        />
      ))}
    </div>
  )
}

export default WorkflowList
