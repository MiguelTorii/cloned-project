import React, { memo, useContext, useMemo, useCallback, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import cx from 'classnames';
import WorkflowBoardCard from './WorkflowBoardCard';
import WorkflowContext from '../../containers/Workflow/WorkflowContext';
import { useStyles } from '../_styles/Workflow/WorkflowBoardBox';

type Props = {
  buttonColor?: any;
  bgcolor?: any;
  categoryId?: any;
  drop?: any;
  name?: any;
  list?: any;
  tasks?: any;
};

const WorkflowBoardBox = ({ buttonColor, bgcolor, categoryId, drop, name, list, tasks }: Props) => {
  const { handleAddTask, announcementData } = useContext(WorkflowContext);
  const classes: any = useStyles();
  const [showNew, setShowNew] = useState(false);
  const [newInputValue, setNewInputValue] = useState('');
  const openNew = useCallback(() => setShowNew(true), []);
  const closeNew = useCallback(() => {
    setShowNew(false);
    setNewInputValue('');
  }, []);
  const handleChange = useCallback((e) => setNewInputValue(e.target.value), []);
  const handleNew = useCallback(async () => {
    if (newInputValue) {
      await handleAddTask({
        title: newInputValue,
        categoryId
      });
    }

    closeNew();
  }, [closeNew, newInputValue, categoryId, handleAddTask]);
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        handleNew();
      }
    },
    [handleNew]
  );
  const newInput = useMemo(
    () => (
      <div className={classes.inputContainer}>
        {!newInputValue && (
          <Typography className={classes.placeholder}>Enter a title for this task</Typography>
        )}
        <TextField
          fullWidth
          className={cx(classes.textField, 'workflow-task-text-area')}
          InputProps={{
            className: classes.multilineColor
          }}
          autoFocus
          multiline
          rowsMax={3}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </div>
    ),
    [handleKeyDown, handleChange, classes, newInputValue]
  );
  const containerStyle = useMemo(
    () => (announcementData ? classes.containerAnnouncement : classes.listContainer),
    [announcementData, classes.containerAnnouncement, classes.listContainer]
  );
  return useMemo(
    () => (
      <Grid
        ref={drop}
        className={classes.container}
        style={{
          backgroundColor: bgcolor
        }}
        id={`board-${name}`}
      >
        <Grid container justifyContent="space-between" alignItems="center" direction="column">
          <Grid item className={classes.headerItem}>
            <Typography className={classes.title}>{name}</Typography>
          </Grid>
          <Grid item className={classes.headerItem}>
            <Button
              style={{
                backgroundColor: buttonColor
              }}
              className={cx(classes.button, 'create-task-button')}
              onClick={openNew}
            >
              + Add a task
            </Button>
          </Grid>
        </Grid>
        <Grid container className={containerStyle}>
          <div className={classes.newContainer}>
            {showNew && (
              <WorkflowBoardCard newInput={newInput} handleNew={handleNew} closeNew={closeNew} />
            )}
          </div>
          {list}
        </Grid>
      </Grid>
    ),
    [
      bgcolor,
      buttonColor,
      classes.button,
      classes.container,
      classes.headerItem,
      classes.newContainer,
      classes.title,
      closeNew,
      containerStyle,
      drop,
      handleNew,
      list,
      name,
      newInput,
      openNew,
      showNew
    ]
  );
};

export default memo(WorkflowBoardBox);
