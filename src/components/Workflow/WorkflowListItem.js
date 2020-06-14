import React, { useMemo } from 'react'
// import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
// import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked'
import { makeStyles , useTheme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator'
// import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import Grid from '@material-ui/core/Grid'
import moment from 'moment'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Chip from '@material-ui/core/Chip'
import cx from 'classnames'
import Typography from '@material-ui/core/Typography'

const getTitle = (downMd, downSm, downXs, title) => {
  if (downXs) return title
  if (downSm) return title.substr(0, 45)
  if (downMd) return title.substr(0, 75)
  return title
}

const getStyles = hide => {
  return {
    opacity: hide ? 0 : 1,
    height: hide ? 0 : ""
  }
}

const useStyles = makeStyles(theme => ({
  detailsButton: {
    padding: theme.spacing(0, 1),
    color: theme.circleIn.palette.action,
    '& .MuiButtonBase-root': {
      minHeight: 0,
    }
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
    minHeight: 40,
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
    cursor: 'pointer',
    textAlign: 'left'
  },
  taskTitle: {
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
  titleContainer: {
    maxWidth: '100%',
    alignItems: 'center',
    display: 'flex'
  },
  empty: {
    height: '100%',
    width: '100%'
  },
  iconButton: {
    padding: 0
  }
}))

const WorkflowListItem = ({
  task,
  classList,
  openConfirmArchive,
  onOpen,
  showDetails,
  isDragging,
  // handleComplete,
  drag
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const downMd = useMediaQuery(theme.breakpoints.down('md'))
  const downSm = useMediaQuery(theme.breakpoints.down('sm'))
  const downXs = useMediaQuery(theme.breakpoints.down('xs'))

  const title = getTitle(downMd, downSm, downXs, task.title)
  const renderTask = useMemo(() => {
    const selected = classList[task.sectionId]

    return (
      <Grid container alignItems='center'>
        <Grid container direction='row' item xs={10} sm={6} md={7}>
          <Grid item className={classes.titleContainer}>
            <Typography className={classes.taskTitle}>
              {title}
            </Typography>
          </Grid>
          <Grid item style={getStyles(isDragging || !showDetails)}>
            <Button className={classes.detailsButton} onClick={onOpen}>Details</Button>
            <IconButton onClick={openConfirmArchive} className={classes.iconButton}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Grid item xs={6} md={2} className={classes.itemDetails}>
          {task.date && <Typography variant="caption" className={classes.dateText} display="block" gutterBottom>
            {moment(task.date).format('MMM D')}
          </Typography>}
        </Grid>
        <Grid item xs={6} md={3} className={classes.itemDetails}>
          {selected && <Chip
            label={selected.className} size='small'
            style={{ backgroundColor: selected.bgColor }}
            className={cx(classes.chip, classes.ellipsis)}
          />}
        </Grid>
      </Grid>
    )}, [task, classList, classes, title, isDragging, showDetails, openConfirmArchive, onOpen])

  return (
    <ListItem
      className={classes.item}
      selected={showDetails}
      dense
    >
      <div
        ref={drag}
        className={classes.dragContainer}
      >
        <DragIndicatorIcon className={classes.dragIcon} style={getStyles(isDragging || !showDetails)} />
      </div>
      {/* <ListItemIcon> */}
      {/* <IconButton onClick={handleComplete} className={classes.iconButton}> */}
      {/* {task.status === 2 ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />} */}
      {/* </IconButton> */}
      {/* </ListItemIcon> */}
      <ListItemText primary={renderTask} onClick={onOpen} />
    </ListItem>
  )
}

export default WorkflowListItem
