import React, { useMemo, useState, useEffect } from 'react'
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
    width: 245,
    marginTop: theme.spacing(),
    borderRadius: theme.spacing(),
    padding: theme.spacing(2),
    cursor: 'grab',
    backgroundColor: '#FFF',
    '-webkit-box-shadow': '10px 10px 25px -15px rgba(0,0,0,0.75)',
    '-moz-box-shadow': '10px 10px 25px -15px rgba(0,0,0,0.75)',
    'box-shadow': '10px 10px 25px -15px rgba(0,0,0,0.75)',
  },
  container: {
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
  icon: {
    color: theme.circleIn.palette.normalButtonText1,
  },
  title: {
    fontWeight: 'bold',
    color: theme.circleIn.palette.normalButtonText1,
    overflow: 'hidden',
    wordBreak: 'break-word',
    textOverflow: 'ellipsis',
    maxHeight: '4.5em',
    marginBottom: theme.spacing(),
    lineHeight: '1.5em',
  },
  date: {
    color: theme.circleIn.palette.normalButtonText1,
    fontWeight: 'bold'
  },
  detailsButton: {
    minWidth: 45,
    padding: 0,
    color: theme.circleIn.palette.darkActionBlue
  },
  iconButton: {
    padding: 0
  },
  hover: {
    position: 'relative',
    bottom: 4
  },
  bottom: {
    minHeight: theme.spacing(3)
  },
  newButton: {
    color: theme.circleIn.palette.normalButtonText1,
    fontWeight: 'bold'
  },
  oneLine: {
    height: '1.5rem'
  },
  twoLines: {
    height: '3rem'
  },
  threeLines: {
    height: '4.5rem'
  },
  buttons: {
    height: theme.spacing(5)
  }
}))

const WorkflowBoardCard = ({
  onOpen,
  newInput,
  handleNew,
  closeNew,
  title,
  date,
  selectedClass,
  openConfirmArchive,
  showDetails,
}) => {
  const classes = useStyles()
  const [clampTitle, setClampTitle] = useState(title)
  const [lineStyle, setLineStyle] = useState(classes.oneLine)

  useEffect(() => {
    if (title) {
      setClampTitle(title)
      if (title.length <= 25) {
        setLineStyle(classes.oneLine)
      }
      if (title.length <= 50 && title.length > 25) {
        if(title.length > 45) setClampTitle(`${title.substr(0, 45)}...`)
        setLineStyle(classes.twoLines)
      }
      if (title.length > 50) {
        if(title.length > 70) setClampTitle(`${title.substr(0, 70)}...`)
        setLineStyle(classes.threeLines)
      }
    }
  }, [title, classes])

  const dateSize = useMemo(() => selectedClass ? 3 : 8, [selectedClass])

  return (
    <Paper className={cx(classes.root, showDetails && classes.hover)} elevation={0} onClick={onOpen}>
      <Grid container className={classes.container} direction='row'>
        <Grid item xs={12}>
          {newInput || <Typography variant='body1' className={cx(classes.title, lineStyle)}>{clampTitle}</Typography>}
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
              <DeleteIcon className={classes.icon} />
            </IconButton>
          </Grid>}
          {newInput && <Grid item xs={12} className={classes.buttons}>
            <Button className={classes.newButton} onClick={handleNew} variant='contained' color='primary'>Add</Button>
            <Button className={classes.newButton} onClick={closeNew}>Cancel</Button>
          </Grid>}
        </Grid>
      </Grid>
    </Paper>
  )
}

export default WorkflowBoardCard
