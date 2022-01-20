import React, { useRef, useEffect, useState, useCallback, useReducer } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { bindActionCreators } from 'redux';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import update from 'immutability-helper';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import cx from 'classnames';
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import { experienceActions } from 'hud/experienceBarState/hudExperienceActions';
import CreateWorkflow from '../../components/Workflow/CreateWorkflow';
import WorkflowList from '../../components/Workflow/WorkflowList';
import CalendarView from '../../components/Workflow/CalendarView';
import {
  createTodo,
  updateTodo,
  archiveTodo,
  updateTodosOrdering,
  getTodos
} from '../../api/workflow';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import Tips from '../../components/Workflow/Tips';
import { WorkflowProvider } from './WorkflowContext';
import * as notificationsActions from '../../actions/notifications';
import { CampaignState } from '../../reducers/campaign';

const createSnackbar = (message, style, variant) => ({
  notification: {
    message,
    options: {
      variant,
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left'
      },
      autoHideDuration: 7000,
      ContentProps: {
        classes: {
          root: style
        }
      }
    }
  }
});

const styles = (theme) => ({
  title: {
    fontWeight: 700,
    fontSize: 28
  },
  stackbar: {
    backgroundColor: theme.circleIn.palette.snackbar,
    color: theme.circleIn.palette.primaryText1
  },
  container: {
    flexWrap: 'inherit'
  },
  body: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing()
  },
  bodyCalendar: {
    padding: theme.spacing(0, 2, 2, 2),
    marginBottom: theme.spacing()
  },
  bodyList: {},
  button: {
    fontSize: 16
  },
  bodyBoard: {
    backgroundColor: 'transparent'
  },
  divider: {
    padding: theme.spacing(0, 1)
  }
});

type Props = {
  classes?: Record<string, any>;
  enqueueSnackbar?: (...args: Array<any>) => any;
  user?: UserState;
};

function reducer(state, action) {
  const { type } = action;

  switch (type) {
    case 'INIT':
      return update(state, {
        tasks: {
          $set: action.tasks
        }
      });

    case 'ADD_TASK':
      return { ...state, tasks: [{ ...action.task }, ...state.tasks] };

    case 'ARCHIVE_TASK':
      return update(state, {
        tasks: {
          $splice: [[action.index, 1]]
        }
      });

    case 'REORDER':
      return update(state, {
        tasks: {
          $splice: [
            [action.dragIndex, 1],
            [action.hoverIndex, 0, action.dragTask]
          ]
        }
      });

    case 'UPDATE_CATEGORY': {
      return update(state, {
        tasks: {
          [action.index]: {
            categoryId: {
              $set: action.categoryId
            }
          }
        }
      });
    }

    case 'UPDATE_ITEM':
      return update(state, {
        tasks: {
          [action.index]: {
            title: {
              $set: action.title
            },
            categoryId: {
              $set: action.categoryId || 0
            },
            description: {
              $set: action.description || ''
            },
            firstNotificationSeconds: {
              $set: action.firstNotificationSeconds
            },
            date: {
              $set: action.date
            },
            sectionId: {
              $set: action.sectionId || ''
            },
            status: {
              $set: action.status
            },
            notifications: {
              $set: action.notifications || []
            },
            images: {
              $set: action.images
            }
          }
        }
      });

    case 'DRAG_UPDATE':
      return update(state, {
        dragId: {
          $set: action.dragId
        }
      });

    default:
      return state;
  }
}

const initialState = {
  dragId: null,
  tasks: []
};

const Workflow = ({ user, enqueueSnackbar, classes }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { tasks, dragId } = state;
  const [classList, setClassList] = useState({});
  const {
    data: { firstName, userId },
    userClasses,
    announcementData
  } = user;
  const [listView, setListView] = useState(false);
  const [calendarView, setCalendarView] = useState(false);
  const [tips, setTips] = useState(false);
  const [currentCalendarView, setCurrentCalendarView] = useState('dayGridMonth');
  const reduxDispatch = useDispatch();

  const isHud: boolean | null = useSelector(
    (state: { campaign: CampaignState }) => state.campaign.hud
  );

  const openTips = useCallback(() => setTips(true), []);
  const closeTips = useCallback(() => setTips(false), []);
  const showBoardView = useCallback(() => {
    setCalendarView(false);
    setListView(false);
  }, []);
  const showListView = useCallback(() => {
    setCalendarView(false);
    setListView(true);
  }, []);
  const showCalendarView = useCallback(() => setCalendarView(true), []);
  const init = useCallback(async () => {
    const res = await getTodos();

    if (res) {
      dispatch({
        type: 'INIT',
        tasks: res
      });
    } else {
      enqueueSnackbar(createSnackbar('Failed to initialize', classes.snackbar, 'error'));
    }
  }, [classes.snackbar, enqueueSnackbar]);
  useEffect(() => {
    init();
  }, [init]);
  const archiveTask = useCallback(
    async (task) => {
      const res = await archiveTodo({
        id: task.id
      });

      if (res?.id) {
        dispatch({
          type: 'ARCHIVE_TASK',
          index: task.index
        });
      }
    },
    [dispatch]
  );
  const moveTask = useCallback(
    (dragIndex, hoverIndex) => {
      const dragTask = state.tasks[dragIndex];
      dispatch({
        type: 'REORDER',
        dragIndex,
        hoverIndex,
        dragTask
      });
    },
    [state, dispatch]
  );
  const dragCategoryId = useRef();
  const updateCategory = useCallback(
    async (index, categoryId) => {
      dragCategoryId.current = categoryId;
      dispatch({
        type: 'UPDATE_CATEGORY',
        index,
        categoryId
      });
    },
    [dispatch]
  );
  const [prevDragId, setPrevDragId] = useState(null);
  const reorder = useCallback(async () => {
    let ordering = [];
    tasks.forEach((t, position) => {
      if (t.order !== position) {
        ordering = [
          ...ordering,
          {
            id: t.id,
            position
          }
        ];
      }
    });
    await updateTodosOrdering({
      ordering
    });
  }, [tasks]);
  const onDrag = useCallback(
    async (dragId) => {
      if (dragId === null && prevDragId !== null && dragCategoryId?.current) {
        const task = tasks.find((t) => t.id === prevDragId);
        const res = await updateTodo({ ...task, categoryId: dragCategoryId.current });

        if (res?.points) {
          reduxDispatch({
            type: experienceActions.ADD_EXPERIENCE_POINTS,
            payload: {
              experiencePoints: res.points
            }
          });

          enqueueSnackbar(
            createSnackbar(
              `Congratulations ${firstName}, you have just earned ${res.points} points. Good Work!`,
              classes.snackbar,
              'success'
            )
          );
        }
      }

      dispatch({
        type: 'DRAG_UPDATE',
        dragId
      });
    },
    [prevDragId, tasks, enqueueSnackbar, firstName, classes.snackbar]
  );
  useEffect(() => {
    if (dragId !== prevDragId && dragId === null) {
      reorder();
    }

    setPrevDragId(dragId);
  }, [dragId, prevDragId, reorder]);
  useEffect(() => {
    try {
      const classList = {};
      userClasses.classList.forEach((cl) => {
        if (cl.section && cl.section.length > 0) {
          cl.section.forEach((s) => {
            classList[s.sectionId] = cl;
          });
        }
      });
      setClassList(classList);
    } finally {
      /* NONE */
    }
  }, [userClasses]);
  const [expanded, setExpanded] = useState([true, true, true, true]);
  const handleExpand = useCallback(
    (index) => (expand) => {
      setExpanded(
        update(expanded, {
          [index - 1]: {
            $set: expand
          }
        })
      );
    },
    [expanded]
  );
  useEffect(() => {
    const invalidOrder = tasks.find((t) => t.order === -1);

    if (invalidOrder) {
      reorder();
    }
  }, [reorder, tasks]);
  const handleAddTask = useCallback(
    async ({ title, categoryId, date, sectionId, description }) => {
      if (!title) {
        enqueueSnackbar(createSnackbar('Task name is empty', classes.snackbar, 'error'));
        return;
      }

      try {
        const res = await createTodo({
          title,
          categoryId,
          sectionId,
          date: date ? moment.utc(date).valueOf() : null,
          description
        });

        if (res?.id) {
          dispatch({
            type: 'ADD_TASK',
            task: {
              title,
              date: date || '',
              categoryId: categoryId || 1,
              sectionId: sectionId || '',
              description: description || '',
              order: -1,
              id: res.id,
              status: 1
            }
          });
          handleExpand(1)(true);

          if (res?.points) {
            reduxDispatch({
              type: experienceActions.ADD_EXPERIENCE_POINTS,
              payload: {
                experiencePoints: res.points
              }
            });
            enqueueSnackbar(
              createSnackbar(
                `Congratulations ${firstName}, you have just earned ${res.points} points. Good Work!`,
                classes.snackbar,
                'success'
              )
            );
          }
        }
      } catch (e) {
        enqueueSnackbar(createSnackbar('Failed to add task', classes.snackbar, 'error'));
      }
    },
    [dispatch, handleExpand, enqueueSnackbar, classes, firstName]
  );
  const updateItem = useCallback(
    async ({
      index,
      title,
      date,
      categoryId,
      description,
      sectionId,
      id,
      status,
      images,
      reminder
    }) => {
      if (!title) {
        enqueueSnackbar(createSnackbar('Task name is empty', classes.snackbar, 'error'));
        return;
      }

      if (id === -1) {
        await handleAddTask({
          title,
          sectionId: Number(sectionId),
          categoryId: Number(categoryId),
          reminder,
          description,
          date
        });
      } else {
        const task = tasks[index];
        const newCategory = status === 2 && task.status !== status ? 4 : categoryId;
        const res = await updateTodo({
          id,
          title,
          sectionId: Number(sectionId),
          categoryId: Number(newCategory),
          description,
          reminder,
          date: moment.utc(date).valueOf(),
          status
        });

        if (res?.id) {
          dispatch({
            type: 'UPDATE_ITEM',
            index,
            title,
            date,
            categoryId: newCategory,
            description,
            sectionId,
            status,
            firstNotificationSeconds: reminder || 0,
            images
          });

          if (res?.points) {
            enqueueSnackbar(
              createSnackbar(
                `Congratulations ${firstName}, you have just earned ${res.points} points. Good Work!`,
                classes.snackbar,
                'success'
              )
            );
          }
        } else {
          enqueueSnackbar(createSnackbar('Failed to update task', classes.snackbar, 'error'));
        }
      }
    },
    [dispatch, enqueueSnackbar, classes, tasks, firstName, handleAddTask]
  );
  return (
    <WorkflowProvider
      value={{
        enqueueSnackbar,
        announcementData,
        userId,
        handleAddTask,
        updateCategory,
        listView,
        moveTask,
        classList,
        canAddClasses: userClasses.canAddClasses,
        tasks,
        dragId,
        onDrag,
        expanded,
        handleExpand,
        updateItem,
        archiveTask,
        currentCalendarView,
        setCurrentCalendarView
      }}
    >
      <Grid container direction="column" spacing={0} className={classes.container}>
        <ErrorBoundary>
          <Tips open={tips} close={closeTips} />
          {!isHud && (
            <Box display="flex" alignItems="center">
              <Typography component="span" color="textPrimary" className={classes.title}>
                Workflow
              </Typography>
              <IconButton onClick={init} color="primary" aria-label="refresh" component="span">
                <RefreshIcon />
              </IconButton>
            </Box>
          )}
          <Grid container alignItems="center">
            <Button
              color={cx(!listView && !calendarView ? 'primary' : 'default') as any}
              className={classes.button}
              onClick={showBoardView}
            >
              Board View
            </Button>
            <Button
              color={cx(listView && !calendarView ? 'primary' : 'default') as any}
              onClick={showListView}
              className={classes.button}
            >
              List View
            </Button>
            <Button
              color={cx(calendarView ? 'primary' : 'default') as any}
              onClick={showCalendarView}
              className={classes.button}
            >
              Calendar View
            </Button>
            <div className={classes.divider}>|</div>
            <Button color="default" onClick={openTips} className={classes.button}>
              Tips & Tricks
            </Button>

            {isHud && (
              <IconButton onClick={init} color="primary" aria-label="refresh" component="span">
                <RefreshIcon />
              </IconButton>
            )}
          </Grid>
          {calendarView && (
            <Paper elevation={0} className={classes.bodyCalendar}>
              <CalendarView />
            </Paper>
          )}
          {listView && !calendarView && (
            <Paper elevation={0} className={classes.body}>
              <CreateWorkflow handleAddTask={handleAddTask} />
            </Paper>
          )}
          {!calendarView && (
            <Paper elevation={0} className={cx(classes.bodyList, !listView && classes.bodyBoard)}>
              <WorkflowList />
            </Paper>
          )}
        </ErrorBoundary>
      </Grid>
    </WorkflowProvider>
  );
};

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

const mapDispatchToProps = (dispatch: any): {} =>
  bindActionCreators(
    {
      enqueueSnackbar: notificationsActions.enqueueSnackbar
    },
    dispatch
  );

export default connect<{}, {}, Props>(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles as any)(Workflow));
