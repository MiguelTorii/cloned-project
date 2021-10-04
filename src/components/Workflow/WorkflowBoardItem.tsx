import React, { memo, useMemo } from "react";
import WorkflowBoardCard from "components/Workflow/WorkflowBoardCard";
import moment from "moment";

const WorkflowBoardItem = ({
  task,
  classList,
  openConfirmArchive,
  onOpen,
  showDetails
}) => {
  const date = useMemo(() => {
    if (task.date) {
      if (typeof task.date.getMonth === 'function') {
        return moment(task.date).format('MMM D');
      }

      return moment(`${task.date.replace(' ', 'T')}Z`).format('MMM D');
    }

    return '';
  }, [task.date]);
  const selectedClass = useMemo(() => classList[task.sectionId], [classList, task.sectionId]);
  return useMemo(() => <div>
        <WorkflowBoardCard onOpen={onOpen} title={task.title} date={date} hasNotification={Boolean(task.firstNotificationSeconds)} openConfirmArchive={openConfirmArchive} showDetails={showDetails} selectedClass={selectedClass} />
      </div>, [date, onOpen, openConfirmArchive, selectedClass, showDetails, task.firstNotificationSeconds, task.title]);
};

export default memo(WorkflowBoardItem);