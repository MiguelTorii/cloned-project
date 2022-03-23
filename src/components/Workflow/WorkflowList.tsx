import React, { useContext, useMemo } from 'react';

import cx from 'classnames';

import Grid from '@material-ui/core/Grid';

import { workflowCategories } from 'constants/common';

import WorkflowContext from 'containers/Workflow/WorkflowContext';

import { useStyles } from '../_styles/Workflow/WorkflowList';

import DragPreview from './DragPreview';
import WorkflowBox from './WorkflowBox';

const WorkflowList = () => {
  const { tasks, listView } = useContext(WorkflowContext);
  const indexed = useMemo(() => tasks.map((t, index) => ({ ...t, index })), [tasks]);
  const upcoming = useMemo(() => indexed.filter((t) => t.categoryId === 1), [indexed]);
  const inprogress = useMemo(() => indexed.filter((t) => t.categoryId === 2), [indexed]);
  const ready = useMemo(() => indexed.filter((t) => t.categoryId === 3), [indexed]);
  const done = useMemo(() => indexed.filter((t) => t.categoryId === 4), [indexed]);
  const classes: any = useStyles();
  const taskLists = [upcoming, inprogress, ready, done];
  const boxes = workflowCategories.map((w, k) => ({ ...w, tasks: taskLists[k] }));
  return (
    <div className={cx(!listView && classes.container)}>
      <DragPreview />
      <div className={classes.item}>
        {listView && (
          <Grid container alignItems="center">
            <Grid item xs={7} />
            <Grid item xs={2} className={classes.headerText}>
              Due Date
            </Grid>
            <Grid item xs={3} className={classes.classText}>
              Class
            </Grid>
          </Grid>
        )}
      </div>
      <div className={cx(!listView && classes.columnContainer)}>
        {boxes.map((box) => (
          <WorkflowBox
            key={box.name}
            tasks={box.tasks}
            bgcolor={box.bgcolor}
            buttonColor={box.buttonColor}
            categoryId={box.categoryId}
            name={box.name}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkflowList;
