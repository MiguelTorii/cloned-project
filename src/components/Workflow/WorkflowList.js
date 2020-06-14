// @flow
import React, { useMemo } from 'react'
import WorkflowBox from 'components/Workflow/WorkflowBox'
import DragPreview from 'components/Workflow/DragPreview'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import { workflowCategories } from 'constants/common'
import cx from 'classnames'

const useStyles = makeStyles(theme => ({
  item: {
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
  },
  columnContainer: {
    display: 'flex',
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
  handleAddTask: Function,
  handleExpand: Function
};

const WorkflowList = ({
  dragId,
  handleAddTask,
  onDrag,
  updateCategory,
  moveTask,
  classList,
  tasks,
  expanded,
  handleExpand,
  listView,
  archiveTask,
  updateItem
}: Props) => {
  const indexed = useMemo(() => tasks.map((t, index) => ({ ...t, index})), [tasks])
  const upcoming = useMemo(() => indexed.filter(t => t.categoryId === 1), [indexed])
  const inprogress = useMemo(() => indexed.filter(t => t.categoryId === 2), [indexed])
  const ready = useMemo(() => indexed.filter(t => t.categoryId === 3), [indexed])
  const done = useMemo(() => indexed.filter(t => t.categoryId === 4), [indexed])
  const classes = useStyles()

  const taskLists = [upcoming, inprogress, ready, done]
  const boxes = workflowCategories.map((w, k) => ({
    ...w,
    tasks: taskLists[k]
  }))

  return (
    <div>
      {listView && <DragPreview />}
      <div className={classes.item}>
        {listView && <Grid container alignItems='center'>
          <Grid item xs={7} />
          <Grid item xs={2} className={classes.headerText}>
            Due Date
          </Grid>
          <Grid item xs={3} className={classes.classText}>
            Class
          </Grid>
        </Grid>}
      </div>
      <div className={cx(!listView && classes.columnContainer)}>
        {boxes.map(box => (
          <WorkflowBox
            handleAddTask={handleAddTask}
            listView={listView}
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
    </div>
  )
}

export default WorkflowList
