import React, { useMemo, useCallback, useState } from 'react'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import AddIcon from '@material-ui/icons/Add'
import IconButton from '@material-ui/core/IconButton'
import WorkflowBoardCard from 'components/Workflow/WorkflowBoardCard'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles(theme => ({
  container: {
    marginRight: theme.spacing(2),
    width: theme.spacing(30),
  },
  titleContainer: {
    padding: theme.spacing(2),
    width: theme.spacing(30),
    borderRadius: theme.spacing()
  },
  title: {
    fontWeight: 'bold'
  },
  iconButton: {
    padding: 0
  },
  listContainer: {
    maxHeight: 'calc(100vh - 265px)',
    overflow: 'overlay'
  },
  inputContainer: {
    position: 'relative'
  },
  placeholder: {
    position: 'absolute',
    color: theme.circleIn.palette.primaryText2,
    top: 4,
    left: 4,
  }
}))

const WorkflowBoardBox = ({ handleAddTask, categoryId, drop, name, list }) => {
  const classes = useStyles()
  const [showNew, setShowNew] = useState(false)
  const [newInputValue, setNewInputValue] = useState('')

  const openNew = useCallback(() => setShowNew(true), [])
  const closeNew = useCallback(() => setShowNew(false), [])

  const handleChange = useCallback(e => setNewInputValue(e.target.value), [])

  const handleNew = useCallback(async () => {
    if (newInputValue) {
      await handleAddTask(newInputValue, categoryId)
      setNewInputValue('')
    }
    closeNew()
  }, [closeNew, newInputValue, categoryId, handleAddTask])

  const handleKeyDown = useCallback(e => {
    if (e.key === 'Enter') handleNew()
  }, [handleNew])

  const newInput = useMemo(() => (
    <div className={classes.inputContainer}>
      {!newInputValue && <Typography className={classes.placeholder}>Enter a title for this task</Typography>}
      <TextField
        fullWidth
        autoFocus
        multiline
        rowsMax={3}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        inputProps={{
          onBlur: handleNew
        }}
      />
    </div>
  ), [handleKeyDown, handleNew, handleChange, classes, newInputValue])

  return (
    <Grid ref={drop} className={classes.container}>
      <Paper elevation={0} className={classes.titleContainer}>
        <Grid container justify='space-between'>
          <Grid item>
            <Typography className={classes.title}>{name}</Typography>
          </Grid>
          <Grid item>
            <IconButton className={classes.iconButton} onClick={openNew}>
              <AddIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>
      <Grid container className={classes.listContainer}>
        {showNew && <WorkflowBoardCard newInput={newInput}/>}
        {list}
      </Grid>
    </Grid>
  )
}

export default WorkflowBoardBox
