import React, { useContext } from 'react';

import clsx from 'clsx';
import moment from 'moment';
import { useDragLayer } from 'react-dnd';

import WorkflowContext from 'containers/Workflow/WorkflowContext';

import { useStyles } from '../_styles/Workflow/DragPreview';

import WorkflowBoardCard from './WorkflowBoardCard';
import WorkflowListItem from './WorkflowListItem';

const getItemStyles = (initialOffset, currentOffset) => {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none'
    };
  }

  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform
  };
};

const DragPreview = () => {
  const { listView, classList } = useContext(WorkflowContext);
  const classes: any = useStyles();
  const { isDragging, task, initialOffset, currentOffset } = useDragLayer((monitor) => ({
    task: monitor.getItem(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }));

  if (!isDragging) {
    return null;
  }

  const date = clsx(task.date && moment(task.date).format('MMM D'));
  const selectedClass = classList[task.sectionId];
  const container = listView ? classes.list : classes.card;
  return (
    <div className={container}>
      <div style={getItemStyles(initialOffset, currentOffset)}>
        {listView ? (
          <WorkflowListItem task={task} classList={classList} />
        ) : (
          <WorkflowBoardCard title={task.title} date={date} selectedClass={selectedClass} />
        )}
      </div>
    </div>
  );
};

export default DragPreview;
