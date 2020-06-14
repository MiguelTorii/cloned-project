import React, { useMemo, useCallback, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import WorkflowBoardCard from 'components/Workflow/WorkflowBoardCard'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles(theme => ({
  container: {
    paddingRight: theme.spacing(2),
    width: theme.spacing(33),
  },
  title: {
    fontSize: 20,
  },
  button: {
    textAlign: 'center',
    backgroundColor: theme.circleIn.palette.deepSeaOcean,
    fontWeight: 'bold',
    fontSize: 16,
    width: theme.spacing(31),
    borderRadius: theme.spacing(),
    '& span': {
      textTransform: 'none',
    },
    margin: theme.spacing(1, 0),
    padding: 0,
    '& hover': {
      backgroundColor: theme.circleIn.palette.brand,
    }
  },
  listContainer: {
    maxHeight: 'calc(100vh - 290px)',
    overflow: 'auto',
    '&::-webkit-scrollbar-corner': {
      background: 'rgba(0,0,0,0)'
    }
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
      <Grid container justify='space-between' direction='column'>
        <Grid item>
          <Typography className={classes.title}>{name}</Typography>
        </Grid>
        <Grid item>
          <Button className={classes.button} onClick={openNew}>
            + Add a task
          </Button>
        </Grid>
      </Grid>
      <Grid container className={classes.listContainer}>
        {showNew && <WorkflowBoardCard newInput={newInput}/>}
        {list}
      </Grid>
    </Grid>
  )
}

export default WorkflowBoardBox
