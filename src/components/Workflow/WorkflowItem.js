// @flow
import React, { useRef, useMemo, useState, useCallback } from 'react'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked'
import { makeStyles } from '@material-ui/core/styles'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator'
import Typography from '@material-ui/core/Typography'
import moment from 'moment'
import Chip from '@material-ui/core/Chip'
import WorkflowEdit from 'components/Workflow/WorkflowEdit'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import { useDrag, useDrop } from 'react-dnd'
import { getEmptyImage } from "react-dnd-html5-backend"
import cx from 'classnames'
import { isMobile } from "react-device-detect"
import IconButton from '@material-ui/core/IconButton'

function getStyles(hide) {
  return {
    opacity: hide ? 0 : 1,
    height: hide ? 0 : ""
  }
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  dragIcon: {
    height: 20,
  },
  dragContainer: {
    position: 'absolute',
    left: 10,
    top: 20,
    cursor: 'grab',
  },
  item: {
    paddingLeft: theme.spacing(3),
    cursor: 'pointer',
    paddingRight: theme.spacing(7),
    position: 'relative'
  },
  chip: {
    color: theme.circleIn.palette.primaryText1,
    fontWeight: 'bold'
  },
  itemDetails: {
    textAlign: 'left'
  },
  hidden: {
    opacity: 0.3,
  }
}))

type Props = {
  classList: array,
  updateItem: Function,
  moveTask: Function,
  task: Object,
  index: number
};

const WorkflowItem = ({ onDrag, dragId, moveTask, index, classList, task, updateItem }: Props) => {
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

  const [, drag, preview] = useDrag({
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
    }
  })

  const isDragging = useMemo(() => dragId === task.id, [dragId, task])

  preview(getEmptyImage(), { captureDraggingState: true })
  const classes = useStyles()
  const hiddenClass = dragId === task.id ? classes.hidden : ''
  // const hiddenClass = classes.hidden

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

  const renderTask = useMemo(() => {
    const selected = classList[task.sectionId]
    const dateSize = Number(Boolean(task.date) && 2)
    const classSize = Number(Boolean(selected) && 2)
    const titleSize = 10 - dateSize - classSize

    return (
      <Grid container alignItems='center'>
        <Grid item xs={10} md={titleSize}>
          {task.title}
        </Grid>
        {task.date && <Grid item xs={classSize ? 6 : 2} md={dateSize} className={classes.itemDetails}>
          <Typography variant="caption" display="block" gutterBottom>
          Due {moment(task.date).format('MMM D')}
          </Typography>
        </Grid>}
        {selected && <Grid item xs={6} md={classSize} className={classes.itemDetails}>
          <Chip
            label={selected.className} size='small'
            style={{ backgroundColor: selected.bgColor }}
            className={classes.chip}
          />
        </Grid>}
      </Grid>
    )}, [task, classList, classes])

  drag(drop(taskRef))

  const handleComplete = useCallback(() => {
    const { status, ...other } = task
    updateItem({ status: status === 1 ? 2 : 1, ...other })
  }, [task, updateItem])

  return (
    <div
      ref={taskRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cx(classes.root, hiddenClass)}
    >
      <WorkflowEdit
        task={task}
        classList={classList}
        onClose={onClose}
        open={open}
        updateItem={updateItem}
      />
      <ListItem
        className={classes.item}
        selected={showDetails}
      >
        {showDetails && <div
          ref={drag}
          className={classes.dragContainer}
        >
          <DragIndicatorIcon className={classes.dragIcon} style={getStyles(dragId !== null)} />
        </div>}
        <ListItemIcon>
          <IconButton onClick={handleComplete}>
            {task.status === 2 ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
          </IconButton>
        </ListItemIcon>
        <ListItemText primary={renderTask} onClick={onOpen} />
        <ListItemSecondaryAction onClick={onOpen}>
          <Button style={getStyles(isDragging || !showDetails)}>Details</Button>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
    </div>
  )
}

export default WorkflowItem
