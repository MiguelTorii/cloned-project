import React from 'react'
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
  const date = clsx(task.date && moment(task.date).format('MMM D'))
  const selectedClass = classList[task.sectionId]

  return (
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
  )
}

export default WorkflowBoardItem
