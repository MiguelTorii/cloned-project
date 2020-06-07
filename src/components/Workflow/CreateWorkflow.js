// @flow

import React, { useRef, useCallback } from 'react'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(() => ({
  root: {
    width: '100%'
  },
  button: {
    fontWeight: 'bold',
    padding: 0,
  },
}))


type Props = {
  handleAddTask: Function
};

const CreateWorkflow = ({ handleAddTask }: Props) => {
  const taskRef = useRef(null)
  const classes = useStyles()

  const addTask = useCallback(() => {
    if (!taskRef.current.value) return
    handleAddTask(taskRef.current.value)
    taskRef.current.value = ''
  }, [handleAddTask])

  const onKeyPress = useCallback(e => {
    if(e.key === 'Enter') addTask()
  }, [addTask])

  return (
    <Grid
      container
      className={classes.root}
      justify='space-between'
      alignItems='center'
      spacing={1}
    >
      <Grid item xs={12} md={10}>
        <TextField
          inputProps={{
            ref: taskRef,
            onKeyPress
          }}
          variant='outlined'
          fullWidth
          size='small'
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <Button
          variant='contained'
          className={classes.button}
          fullWidth
          onClick={addTask}
          color='primary'
        >
          Add Task
        </Button>
      </Grid>
    </Grid>
  )
}

export default CreateWorkflow
