// @flow
import React, { useContext, useRef, useState, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import WorkflowEdit from 'components/Workflow/WorkflowEdit'
import { useDrag, useDrop } from 'react-dnd'
import { getEmptyImage } from "react-dnd-html5-backend"
import cx from 'classnames'
import { isMobile } from "react-device-detect"
import Dialog, { dialogStyle } from 'components/Dialog';
import WorkflowListItem from 'components/Workflow/WorkflowListItem'
import WorkflowBoardItem from 'components/Workflow/WorkflowBoardItem'
import WorkflowContext from 'containers/Workflow/WorkflowContext'

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
  },
  hidden: {
    opacity: 0,
  },
  iconButton: {
    padding: 0
  },
  dialog: {
    ...dialogStyle,
    width: 600,
  },
  archiveTitle: {
    wordBreak: 'break-word',
    fontSize: 20,
    textAlign: 'center'
  },
  cardItem: {
    width: 245,
  },
  listItem: {
    width: '100%'
  }
}))

type Props = {
  task: Object,
  index: number
};

const WorkflowItem = ({
  interpolatingStyle,
  index,
  task,
}: Props) => {
  const {
    updateItem,
    archiveTask,
    listView,
    onDrag,
    dragId,
    moveTask,
    classList,
  } = useContext(WorkflowContext)
  const taskRef = useRef(null)
  const [showDetails, setShowDetails] = useState(false)

  const [, drop] = useDrop({
    accept: 'task',
    hover(item, monitor) {
      if (!taskRef.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) {
        return
      }
      const hoverBoundingRect = taskRef.current?.getBoundingClientRect()
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      moveTask(dragIndex, hoverIndex)
      // eslint-disable-next-line
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: 'task', index, ...task },
    begin() {
      onDrag(task.id)
    },
    end() {
      onDrag(null)
    },
    canDrag() {
      if (isMobile) return showDetails
      return true
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  if (listView) preview(getEmptyImage(), { captureDraggingState: true })
  const classes = useStyles()
  const hiddenClass = dragId === task.id ? classes.hidden : ''

  const [open, setOpen] = useState(false)

  const onOpen = useCallback(() => {
    setOpen(true)
    setShowDetails(false)
  }, [])
  const onClose = useCallback(() => setOpen(false), [])

  const onMouseEnter = useCallback(() => {
    if (!dragId) setShowDetails(true)
  }, [dragId])
  const onMouseLeave = useCallback(() => setShowDetails(false), [])
  drag(drop(taskRef))

  const handleComplete = useCallback(() => {
    const { status, ...other } = task
    updateItem({ status: status === 1 ? 2 : 1, ...other })
  }, [task, updateItem])

  const [confirmArchive, setConfirmArchive] = useState(false)
  const openConfirmArchive = useCallback(() => {
    setConfirmArchive(true)
    setTimeout(() => setOpen(false), 100)
  }, [])

  const closeConfirmArchive = useCallback(() => setConfirmArchive(false), [])

  const archive = useCallback(() => {
    archiveTask(task)
    closeConfirmArchive()
    onClose()
  }, [task, archiveTask, closeConfirmArchive, onClose])


  const moveStyle = {
    position: 'absolute',
    transform: `translate3d(0, ${interpolatingStyle.y}px, 0) scale( ${interpolatingStyle.scale}, ${interpolatingStyle.scale} )`,
  }

  const itemWidth = listView ? classes.listItem : classes.cardItem

  return (
    <div
      ref={taskRef}
      style={moveStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cx(classes.root, hiddenClass, itemWidth)}
    >
      <Dialog
        className={classes.dialog}
        onCancel={closeConfirmArchive}
        open={confirmArchive}
        onOk={archive}
        showActions
        title='Are you sure you want to delete?'
        okTitle='Delete'
        showCancel
      >
        <Typography className={classes.archiveTitle}>{task.title}</Typography>
      </Dialog>
      <WorkflowEdit
        task={task}
        onClose={onClose}
        openConfirmArchive={openConfirmArchive}
        open={open}
      />
      {listView
        ? <WorkflowListItem
          task={task}
          classList={classList}
          openConfirmArchive={openConfirmArchive}
          onOpen={onOpen}
          showDetails={showDetails}
          isDragging={isDragging}
          handleComplete={handleComplete}
          drag={drag}
        />
        : <WorkflowBoardItem
          task={task}
          classList={classList}
          openConfirmArchive={openConfirmArchive}
          onOpen={onOpen}
          showDetails={showDetails}
          drag={drag}
        />}
    </div>
  )
}

export default WorkflowItem
