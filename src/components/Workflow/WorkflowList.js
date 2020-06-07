// @flow
import React, { useMemo } from 'react'
import WorkflowBox from 'components/Workflow/WorkflowBox'
import DragPreview from 'components/Workflow/DragPreview'

type Props = {
  classList: array,
  updateItem: Function,
  moveTask: Function,
  updateCategory: Function,
  tasks: array,
  dragId: number,
  onDrag: Function,
  expanded: array,
  handleExpand: Function
};

const WorkflowList = ({
  dragId,
  onDrag,
  updateCategory,
  moveTask,
  classList,
  tasks,
  expanded,
  handleExpand,
  updateItem
}: Props) => {
  const indexed = useMemo(() => tasks.map((t, index) => ({ ...t, index})), [tasks])
  const upcoming = useMemo(() => indexed.filter(t => t.categoryId === 1), [indexed])
  const inprogress = useMemo(() => indexed.filter(t => t.categoryId === 2), [indexed])
  const ready = useMemo(() => indexed.filter(t => t.categoryId === 3), [indexed])
  const done = useMemo(() => indexed.filter(t => t.categoryId === 4), [indexed])

  const boxes = [
    { name: 'Upcoming', tasks: upcoming, categoryId: 1 },
    { name: 'In progress', tasks: inprogress, categoryId: 2 },
    { name: 'Ready to submit', tasks: ready, categoryId: 3 },
    { name: 'Done', tasks: done, categoryId: 4 }
  ]

  return (
    <div>
      <DragPreview />
      {boxes.map(box => (
        <WorkflowBox
          dragId={dragId}
          onDrag={onDrag}
          updateCategory={updateCategory}
          key={box.name}
          tasks={box.tasks}
          categoryId={box.categoryId}
          classList={classList}
          moveTask={moveTask}
          updateItem={updateItem}
          expanded={expanded}
          name={box.name}
          handleExpand={handleExpand}
        />
      ))}
    </div>
  )
}

export default WorkflowList
