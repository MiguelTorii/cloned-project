// @flow
import React, {
  memo,
  useContext,
  useRef,
  useState,
  useCallback,
  useMemo
} from 'react';
import Typography from '@material-ui/core/Typography';
import WorkflowEdit from 'components/Workflow/WorkflowEdit';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import cx from 'classnames';
import { isMobile } from 'react-device-detect';
import Dialog from 'components/Dialog/Dialog';
import WorkflowListItem from 'components/Workflow/WorkflowListItem';
import WorkflowBoardItem from 'components/Workflow/WorkflowBoardItem';
import WorkflowContext from 'containers/Workflow/WorkflowContext';
import { useStyles } from '../_styles/Workflow/WorkflowItem';

type Props = {
  task: Object,
  index: number
};

const WorkflowItem = ({ index, task }: Props) => {
  const {
    updateItem,
    archiveTask,
    listView,
    onDrag,
    dragId,
    moveTask,
    classList
  } = useContext(WorkflowContext);
  const taskRef = useRef(null);
  const [showDetails, setShowDetails] = useState(false);

  const [, drop] = useDrop({
    accept: 'task',
    hover(item, monitor) {
      if (!taskRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = taskRef.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveTask(dragIndex, hoverIndex);
      // eslint-disable-next-line
      item.index = hoverIndex;
    }
  });

  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: 'task', index, ...task },
    begin() {
      onDrag(task.id);
    },
    end() {
      onDrag(null);
    },
    canDrag() {
      if (isMobile) return showDetails;
      return true;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  if (listView) preview(getEmptyImage(), { captureDraggingState: true });
  const classes = useStyles();
  const hiddenClass = dragId === task.id ? classes.hidden : '';

  const [open, setOpen] = useState(false);

  const onOpen = useCallback(() => {
    setOpen(true);
    setShowDetails(false);
  }, []);
  const onClose = useCallback(() => setOpen(false), []);

  const onMouseEnter = useCallback(() => {
    if (!dragId) setShowDetails(true);
  }, [dragId]);
  const onMouseLeave = useCallback(() => setShowDetails(false), []);
  drag(drop(taskRef));

  const handleComplete = useCallback(() => {
    const { status, ...other } = task;
    updateItem({ status: status === 1 ? 2 : 1, ...other });
  }, [task, updateItem]);

  const [confirmArchive, setConfirmArchive] = useState(false);
  const openConfirmArchive = useCallback(() => {
    setConfirmArchive(true);
    setTimeout(() => setOpen(false), 100);
  }, []);

  const closeConfirmArchive = useCallback(() => setConfirmArchive(false), []);

  const archive = useCallback(() => {
    archiveTask(task);
    closeConfirmArchive();
    onClose();
  }, [task, archiveTask, closeConfirmArchive, onClose]);

  const itemWidth = useMemo(
    () => (listView ? classes.listItem : classes.cardItem),
    [classes.cardItem, classes.listItem, listView]
  );

  return useMemo(
    () => (
      <div
        ref={taskRef}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={cx(classes.root, hiddenClass, itemWidth)}
      >
        <Dialog
          className={classes.dialog}
          onCancel={closeConfirmArchive}
          open={confirmArchive}
          onOk={archive}
          showActions
          title="Are you sure you want to delete?"
          okTitle="Delete"
          showCancel
        >
          <Typography className={classes.archiveTitle}>{task.title}</Typography>
        </Dialog>
        <WorkflowEdit
          task={task}
          onClose={onClose}
          openConfirmArchive={openConfirmArchive}
          open={open}
        />
        {listView ? (
          <WorkflowListItem
            task={task}
            classList={classList}
            openConfirmArchive={openConfirmArchive}
            onOpen={onOpen}
            showDetails={showDetails}
            isDragging={isDragging}
            handleComplete={handleComplete}
            drag={drag}
          />
        ) : (
          <WorkflowBoardItem
            task={task}
            classList={classList}
            openConfirmArchive={openConfirmArchive}
            onOpen={onOpen}
            showDetails={showDetails}
            drag={drag}
          />
        )}
      </div>
    ),
    [
      archive,
      classList,
      classes.archiveTitle,
      classes.dialog,
      classes.root,
      closeConfirmArchive,
      confirmArchive,
      drag,
      handleComplete,
      hiddenClass,
      isDragging,
      itemWidth,
      listView,
      onClose,
      onMouseEnter,
      onMouseLeave,
      onOpen,
      open,
      openConfirmArchive,
      showDetails,
      task
    ]
  );
};

export default memo(WorkflowItem);
