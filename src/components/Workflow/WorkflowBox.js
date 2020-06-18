// @flow
import React, { useMemo, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import WorkflowItem from 'components/Workflow/WorkflowItem'
import List from '@material-ui/core/List'
import { useDrop } from 'react-dnd'
import WorkflowListBox from 'components/Workflow/WorkflowListBox'
import WorkflowBoardBox from 'components/Workflow/WorkflowBoardBox'
import { Motion, spring } from "react-motion"

const useStyles = makeStyles(() => ({
  header: {
    fontWeight: 'bold',
    fontSize: 20
  },
  list: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    padding: 0
  },
}))

const getHeight = text => {
  const el = document.createElement('div')
  el.style.cssText = 'line-height: 1.5em;width: 213px;font-size: 1rem;font-weight: bold;word-break: break-word;'
  el.textContent = text
  el.style.visibility = ''
  document.body.appendChild(el)
  const height = el.clientHeight
  el.remove()
  return height
}

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

  const renderList = useMemo(() => {
    let space = 0
    let nextSpace = 0
    const height = listView ? { height: 32 * tasks.length } : {}
    return (
      <List className={classes.list} style={height}>
        {tasks.map((t, i) => {
          if (listView && i !== 0) space += 32
          else {
            space = nextSpace
            const titleHeight = getHeight(t.title)

            if (titleHeight <= 25) nextSpace += 100
            if (titleHeight <= 50 && titleHeight > 25) nextSpace += 120
            if (titleHeight > 50) nextSpace += 150
          }
          return (
            <Motion
              key={t.id}
              defaultStyle={{
                scale: 0,
                y: space,
              }}
              style={{
                y: spring(space, { stiffness: 400, damping: 28 }),
                scale: spring(1, { stiffness: 400, damping: 22 })
              }}
            >
              {interpolatingStyle => {
                return (
                  <WorkflowItem
                    interpolatingStyle={interpolatingStyle}
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
                );
              }}
            </Motion>
          )})}
      </List>
    )}, [classList, tasks, archiveTask, listView, dragId, onDrag, updateItem, moveTask, classes])

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
