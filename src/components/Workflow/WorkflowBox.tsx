import React, { memo, useContext, useMemo, useCallback } from 'react';
import List from '@material-ui/core/List';
import { useDrop } from 'react-dnd';
import { Motion, spring } from 'react-motion';
import { DragTypes } from 'constants/enums';
import WorkflowItem from './WorkflowItem';
import WorkflowListBox from './WorkflowListBox';
import WorkflowBoardBox from './WorkflowBoardBox';
import WorkflowContext from '../../containers/Workflow/WorkflowContext';
import { useStyles } from '../_styles/Workflow/WorkflowBox';

const getHeight = (text) => {
  const el = document.createElement('div');
  el.style.cssText =
    'line-height: 1.5em;width: 213px;font-size: 1rem;font-weight: bold;word-break: break-word;';
  el.textContent = text;
  el.style.visibility = '';
  document.body.appendChild(el);
  const height = el.clientHeight;
  el.remove();
  return height;
};

const WorkflowBox = ({ bgcolor, tasks, categoryId, name, buttonColor }) => {
  const { expanded, listView, handleExpand, updateCategory } = useContext(WorkflowContext);
  const classes: any = useStyles();
  const [, drop] = useDrop({
    accept: DragTypes.TASK,
    drop: () => ({
      categoryId
    }),

    hover(item: any, monitor) {
      if (monitor.isOver()) {
        if (categoryId !== item.categoryId) {
          handleExpand(categoryId)(true);
          updateCategory(item.index, categoryId);
          // eslint-disable-next-line
          item.categoryId = categoryId;
        }
      }
    }
  });
  const isExpanded = useMemo(() => expanded[categoryId - 1], [categoryId, expanded]);
  const onExpand = useCallback(
    () => handleExpand(categoryId)(!isExpanded),
    [handleExpand, categoryId, isExpanded]
  );
  const renderList = useMemo(() => {
    let space = 0;
    let nextSpace = 0;
    const height = listView
      ? {
          height: 32 * tasks.length
        }
      : {};
    return (
      <List className={classes.list} style={height}>
        {tasks.map((t, i) => {
          if (listView && i !== 0) {
            space += 32;
          } else {
            space = nextSpace;
            const titleHeight = getHeight(t.title);

            if (titleHeight <= 25) {
              nextSpace += 100;
            }

            if (titleHeight <= 50 && titleHeight > 25) {
              nextSpace += 120;
            }

            if (titleHeight > 50) {
              nextSpace += 150;
            }
          }

          return (
            <Motion
              key={t.id}
              defaultStyle={{
                scale: 0,
                y: space
              }}
              style={{
                y: spring(space, {
                  stiffness: 400,
                  damping: 28
                }),
                scale: spring(1, {
                  stiffness: 400,
                  damping: 22
                })
              }}
            >
              {(interpolatingStyle) => {
                const moveStyle: any = {
                  paddingLeft: 12,
                  width: '100%',
                  position: 'absolute',
                  transform: `translate3d(0, ${interpolatingStyle.y}px, 0) scale( ${interpolatingStyle.scale}, ${interpolatingStyle.scale} )`
                };
                return (
                  <div style={moveStyle}>
                    <WorkflowItem index={t.index} key={t.id} task={t} />
                  </div>
                );
              }}
            </Motion>
          );
        })}
      </List>
    );
  }, [classes, tasks, listView]);
  return useMemo(
    () =>
      listView ? (
        <WorkflowListBox
          list={renderList}
          drop={drop}
          name={name}
          tasks={tasks}
          isExpanded={isExpanded}
          onExpand={onExpand}
        />
      ) : (
        <WorkflowBoardBox
          list={renderList}
          drop={drop}
          bgcolor={bgcolor}
          buttonColor={buttonColor}
          name={name}
          categoryId={categoryId}
          tasks={tasks}
        />
      ),
    [
      bgcolor,
      buttonColor,
      categoryId,
      drop,
      isExpanded,
      listView,
      name,
      onExpand,
      renderList,
      tasks
    ]
  );
};

export default memo(WorkflowBox);
