import React, { useMemo } from 'react'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Chip from '@material-ui/core/Chip'
import cx from 'classnames'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(),
    borderRadius: theme.spacing(),
    padding: theme.spacing(2),
    cursor: 'grab',
    backgroundColor: theme.circleIn.palette.flashcardBackground
  },
  container: {
    height: '100%',
  },
  chip: {
    color: theme.circleIn.palette.primaryText1,
    fontWeight: 'bold'
  },
  ellipsis: {
    maxWidth: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  title: {
    fontWeight: 'bold',
    overflow: 'hidden',
    wordBreak: 'break-word',
    textOverflow: 'ellipsis',
    maxHeight: '4.5em',
    marginBottom: theme.spacing(),
    lineHeight: '1.5em',
  },
  date: {
    fontWeight: 'bold'
  },
  detailsButton: {
    minWidth: 45,
    padding: 0,
    color: theme.circleIn.palette.action
  },
  iconButton: {
    padding: 0
  },
  hover: {
    position: 'relative',
    bottom: 4
  },
  bottom: {
    height: theme.spacing(3),
  }
}))

const WorkflowBoardCard = ({
  onOpen,
  newInput,
  title,
  date,
  selectedClass,
  openConfirmArchive,
  showDetails,
}) => {
  const classes = useStyles()

  const clampTitle = useMemo(() => cx(
    title && title.length > 75
      ? `${title.substr(0, 75)  }...`
      : title
  ), [title])

  const dateSize = useMemo(() => selectedClass ? 3 : 8, [selectedClass])

  return (
    <Paper className={cx(classes.root, showDetails && classes.hover)} elevation={0} onClick={onOpen}>
      <Grid container className={classes.container} direction='row'>
        <Grid item xs={12}>
          {newInput || <Typography variant='body1' className={classes.title}>{clampTitle}</Typography>}
        </Grid>
        <Grid container alignContent='flex-end' alignItems='center' className={classes.bottom}>
          {selectedClass && <Grid item xs={5}>
            <Chip
              label={selectedClass.className} size='small'
              style={{ backgroundColor: selectedClass.bgColor }}
              className={cx(classes.chip, classes.ellipsis)}
            />
          </Grid>}
          <Grid item xs={dateSize}>
            <Typography variant='caption' className={classes.date}>{date}</Typography>
          </Grid>
          {showDetails && <Grid item xs={4}>
            <Button className={classes.detailsButton} onClick={onOpen}>Details</Button>
            <IconButton onClick={openConfirmArchive} className={classes.iconButton}>
              <DeleteIcon />
            </IconButton>
          </Grid>}
        </Grid>
      </Grid>
    </Paper>
  )
}

export default WorkflowBoardCard
