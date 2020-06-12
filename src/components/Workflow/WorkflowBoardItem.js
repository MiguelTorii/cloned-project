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
  isDragging,
  handleComplete,
}) => {
  const date = clsx(task.date && moment(task.date).format('MMM D'))
  const selectedClass = classList[task.sectionId]
  return (
    <div>
      <WorkflowBoardCard
        onOpen={onOpen}
        title={task.title}
        description={task.description}
        date={date}
        selectedClass={selectedClass}
      />
    </div>
  )
}

export default WorkflowBoardItem
