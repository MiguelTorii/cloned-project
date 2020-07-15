import React, { useContext } from 'react'
import { useDragLayer } from 'react-dnd'
import moment from 'moment'
import clsx from 'clsx'
import WorkflowListItem from 'components/Workflow/WorkflowListItem'
import WorkflowBoardCard from 'components/Workflow/WorkflowBoardCard'
import { makeStyles } from '@material-ui/core/styles'
import WorkflowContext from 'containers/Workflow/WorkflowContext'

const useStyles = makeStyles(() => ({
  card: {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 1004,
    left: 0,
    top: 0,
    maxWidth: 31*8,
  },
  list: {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 1004,
    left: 50,
    top: 0,
    width: '50vw',
  }
}))

const getItemStyles = (initialOffset, currentOffset) => {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    }
  }
  const { x, y } = currentOffset

  const transform = `translate(${x}px, ${y}px)`
  return {
    transform,
    WebkitTransform: transform,
  }
}

const DragPreview = () => {
  const { listView, classList } = useContext(WorkflowContext)
  const classes = useStyles()
  const {
    isDragging,
    task,
    initialOffset,
    currentOffset,
  } = useDragLayer((monitor) => ({
    task: monitor.getItem(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }))

  if (!isDragging) {
    return null
  }

  const date = clsx(task.date && moment(task.date).format('MMM D'))
  const selectedClass = classList[task.sectionId]

  const container = listView ? classes.list: classes.card
  return (
    <div className={container}>
      <div
        style={getItemStyles(initialOffset, currentOffset)}
      >
        {listView
          ? <WorkflowListItem task={task} classList={classList}/>
          : <WorkflowBoardCard title={task.title} date={date} selectedClass={selectedClass} />
        }
      </div>
    </div>
  )
}

export default DragPreview
