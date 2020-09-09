import React, { memo, useMemo } from 'react'
import WorkflowBoardCard from 'components/Workflow/WorkflowBoardCard'
import clsx from 'clsx'
import moment from 'moment'

const WorkflowBoardItem = ({
  task,
  classList,
  openConfirmArchive,
  onOpen,
  showDetails,
}) => {
  const date = useMemo(() => clsx(task.date && moment(`${task.date.replace(' ', 'T')}Z`).format('MMM D')), [task.date])
  const selectedClass = useMemo(() => classList[task.sectionId], [classList, task.sectionId])

  return useMemo(() => (
    <div>
      <WorkflowBoardCard
        onOpen={onOpen}
        title={task.title}
        date={date}
        openConfirmArchive={openConfirmArchive}
        showDetails={showDetails}
        selectedClass={selectedClass}
      />
    </div>
  ), [date, onOpen, openConfirmArchive, selectedClass, showDetails, task.title])
}

export default memo(WorkflowBoardItem)
