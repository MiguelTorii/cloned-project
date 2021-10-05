import React, { useRef, useCallback, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import WorkflowContext from '../../containers/Workflow/WorkflowContext';
import { useStyles } from '../_styles/Workflow/CreateWorkflow';

const CreateWorkflow = (props: any) => {
  const { handleAddTask } = useContext<{ handleAddTask: ({ title: string }) => void }>(
    WorkflowContext as any
  );
  const taskRef = useRef(null);
  const classes: any = useStyles();
  const addTask = useCallback(() => {
    if (!taskRef.current.value) {
      return;
    }

    handleAddTask({
      title: taskRef.current.value
    });
    taskRef.current.value = '';
  }, [handleAddTask]);
  const onKeyPress = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        addTask();
      }
    },
    [addTask]
  );
  return (
    <Grid
      container
      className={classes.root}
      justifyContent="space-between"
      alignItems="center"
      spacing={1}
    >
      <Grid item xs={12} md={10}>
        <TextField
          inputProps={{
            ref: taskRef,
            onKeyPress
          }}
          variant="outlined"
          placeholder="Enter a task"
          fullWidth
          size="small"
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <Button
          variant="contained"
          className={classes.button}
          fullWidth
          onClick={addTask}
          color="primary"
        >
          Add Task
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreateWorkflow;
