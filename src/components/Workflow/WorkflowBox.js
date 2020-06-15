// @flow
import React, { useMemo, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import WorkflowItem from 'components/Workflow/WorkflowItem'
import List from '@material-ui/core/List'
import { useDrop } from 'react-dnd'
import WorkflowListBox from 'components/Workflow/WorkflowListBox'
import WorkflowBoardBox from 'components/Workflow/WorkflowBoardBox'

const useStyles = makeStyles(() => ({
  header: {
    fontWeight: 'bold',
    fontSize: 20
  },
  list: {
    width: '100%',
    padding: 0
  },
}))

const WorkflowBox = ({
  handleExpand,
  archiveTask,
  bgcolor,
  buttonColor,
  listView,
  handleAddTask,
  tasks,
  categoryId,
  updateItem,
  classList,
  expanded,
  moveTask,
  updateCategory,
  name,
  onDrag,
  dragId
}) => {
  const classes = useStyles()
  const [, drop] = useDrop({
    accept: 'task',
    drop: () => ({ categoryId }),
    hover(item, monitor) {
      if(monitor.isOver()) {
        if (categoryId !== item.categoryId) {
          handleExpand(categoryId)(true)
          updateCategory(item.index, categoryId)
          // eslint-disable-next-line
          item.categoryId = categoryId
        }
      }
    }
  })

  const isExpanded = useMemo(() => expanded[categoryId-1], [categoryId, expanded])
  const onExpand = useCallback(
    () => handleExpand(categoryId)(!isExpanded),
    [handleExpand, categoryId, isExpanded])

  const renderList = useMemo(() => (
    <List className={classes.list}>
      {tasks.map(t => (
        <WorkflowItem
          classList={classList}
          index={t.index}
          dragId={dragId}
          onDrag={onDrag}
          key={t.id}
          listView={listView}
          task={t}
          archiveTask={archiveTask}
          updateItem={updateItem}
          moveTask={moveTask}
        />
      ))}
    </List>
  ), [classList, tasks, archiveTask, listView, dragId, onDrag, updateItem, moveTask, classes])

  return listView
    ? <WorkflowListBox
      list={renderList}
      drop={drop}
      name={name}
      tasks={tasks}
      isExpanded={isExpanded}
      onExpand={onExpand}
    />
    : <WorkflowBoardBox
      handleAddTask={handleAddTask}
      list={renderList}
      drop={drop}
      bgcolor={bgcolor}
      buttonColor={buttonColor}
      name={name}
      categoryId={categoryId}
      tasks={tasks}
    />
}

export default WorkflowBox
