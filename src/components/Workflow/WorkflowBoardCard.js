import React from 'react'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Chip from '@material-ui/core/Chip'
import cx from 'classnames'
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: theme.spacing(18),
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
  },
  description: {
    wordBreak: 'break-word',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxHeight: '3em',
    lineHeight: '1.5em',
  },
  chipContainer: {
    flexBasis: 0
  }
}))

const WorkflowBoardCard = ({ onOpen, newInput, title, date, selectedClass, description }) => {
  const classes = useStyles()

  const clampDescription = cx(
    description && description.length > 55
      ? `${description.substr(0, 55)  }...`
      : description
  )

  return (
    <Paper className={classes.root} elevation={0} onClick={onOpen}>
      <Grid container className={classes.container} direction='row'>
        <Grid item xs={12}>
          {newInput || <Typography noWrap variant='body1' className={classes.title}>{title}</Typography>}
        </Grid>
        <Grid item xs={12}>
          <Typography variant='body2' className={classes.description}>{clampDescription}</Typography>
        </Grid>
        <Grid container alignContent='flex-end'>
          <Grid item xs={5} className={classes.chipContainer}>
            {selectedClass && <Chip
              label={selectedClass.className} size='small'
              style={{ backgroundColor: selectedClass.bgColor }}
              className={cx(classes.chip, classes.ellipsis)}
            />}
          </Grid>
          <Grid item xs={3}>
            <Typography variant='caption' className={classes.title}>{date}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default WorkflowBoardCard
