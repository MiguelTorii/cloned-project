// @flow
import React, { useRef, useMemo, useState, useCallback } from 'react'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked'
import { makeStyles , useTheme } from '@material-ui/core/styles'
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
import DeleteIcon from '@material-ui/icons/Delete'
import Dialog, { dialogStyle } from 'components/Dialog';
import useMediaQuery from '@material-ui/core/useMediaQuery'


const getStyles = hide => {
  return {
    opacity: hide ? 0 : 1,
    height: hide ? 0 : ""
  }
}

const getTitle = (downMd, downSm, downXs, title) => {
  if (downXs) return title
  if (downSm) return title.substr(0, 30)
  if (downMd) return title.substr(0, 50)
  return title
}

const useStyles = makeStyles(theme => ({
  detailsButton: {
    color: theme.circleIn.palette.action
  },
  root: {
    width: '100%'
  },
  dragIcon: {
    height: 20,
  },
  dragContainer: {
    position: 'absolute',
    left: 0,
    cursor: 'grab',
  },
  item: {
    paddingLeft: theme.spacing(3),
    cursor: 'pointer',
    paddingRight: theme.spacing(14),
    position: 'relative',
  },
  chip: {
    color: theme.circleIn.palette.primaryText1,
    fontWeight: 'bold'
  },
  dateText: {
    fontSize: 12,
    padding: 0,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  itemDetails: {
    textAlign: 'left'
  },
  hidden: {
    opacity: 0.3,
  },
  iconButton: {
    padding: 0
  },
  dialog: {
    ...dialogStyle,
    width: 600,
  },
  archiveTitle: {
    fontSize: 20,
    textAlign: 'center'
  },
  taskTitle: {
    maxWidth: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    fontWeight: 'bold',
    fontSize: 14
  },
  ellipsis: {
    maxWidth: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
}))

type Props = {
  classList: array,
  updateItem: Function,
  moveTask: Function,
  task: Object,
  archiveTask: Function,
  index: number
};

const WorkflowItem = ({ archiveTask, onDrag, dragId, moveTask, index, classList, task, updateItem }: Props) => {
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
  const theme = useTheme()
  const downMd = useMediaQuery(theme.breakpoints.down('md'))
  const downSm = useMediaQuery(theme.breakpoints.down('sm'))
  const downXs = useMediaQuery(theme.breakpoints.down('xs'))
  const title = getTitle(downMd, downSm, downXs, task.title)

  const renderTask = useMemo(() => {
    const selected = classList[task.sectionId]

    return (
      <Grid container alignItems='center'>
        <Grid item xs={10} sm={5} md={6}>
          <Typography className={classes.taskTitle}>
            {title}
          </Typography>
        </Grid>
        <Grid item xs={6} md={2} className={classes.itemDetails}>
          {task.date && <Typography variant="caption" className={classes.dateText} display="block" gutterBottom>
            {moment(task.date).format('MMM D')}
          </Typography>}
        </Grid>
        <Grid item xs={6} md={4} className={classes.itemDetails}>
          {selected && <Chip
            label={selected.className} size='small'
            style={{ backgroundColor: selected.bgColor }}
            className={cx(classes.chip, classes.ellipsis)}
          />}
        </Grid>
      </Grid>
    )}, [task, classList, classes, title])

  drag(drop(taskRef))

  const handleComplete = useCallback(() => {
    const { status, ...other } = task
    updateItem({ status: status === 1 ? 2 : 1, ...other })
  }, [task, updateItem])

  const [confirmArchive, setConfirmArchive] = useState(false)
  const openConfirmArchive = useCallback(() => setConfirmArchive(true), [])
  const closeConfirmArchive = useCallback(() => setConfirmArchive(false), [])

  const archive = useCallback(() => {
    archiveTask(task)
    closeConfirmArchive()
  }, [task, archiveTask, closeConfirmArchive])

  return (
    <div
      ref={taskRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cx(classes.root, hiddenClass)}
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
        classList={classList}
        onClose={onClose}
        open={open}
        updateItem={updateItem}
      />
      <ListItem
        className={classes.item}
        selected={showDetails}
        dense
      >
        {showDetails && <div
          ref={drag}
          className={classes.dragContainer}
        >
          <DragIndicatorIcon className={classes.dragIcon} style={getStyles(dragId !== null)} />
        </div>}
        <ListItemIcon>
          <IconButton onClick={handleComplete} className={classes.iconButton}>
            {task.status === 2 ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
          </IconButton>
        </ListItemIcon>
        <ListItemText primary={renderTask} onClick={onOpen} />
        <ListItemSecondaryAction style={getStyles(isDragging || !showDetails)}>
          <Button className={classes.detailsButton} onClick={onOpen}>Details</Button>
          <IconButton onClick={openConfirmArchive} className={classes.iconButton}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
    </div>
  )
}

export default WorkflowItem
