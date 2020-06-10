// @flow

import React, { useEffect, useState, useCallback, useReducer } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import * as notificationsActions from 'actions/notifications'
import { bindActionCreators } from 'redux'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import CreateWorkflow from 'components/Workflow/CreateWorkflow'
import WorkflowList from 'components/Workflow/WorkflowList'
import Paper from '@material-ui/core/Paper'
import update from 'immutability-helper';
import {
  createTodo,
  updateTodoCategory,
  updateTodo,
  archiveTodo,
  updateTodosOrdering,
  getTodos
} from 'api/workflow'
import type { UserState } from 'reducers/user'
import type { State as StoreState } from 'types/state'
import ErrorBoundary from 'containers/ErrorBoundary'
import moment from 'moment'

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
})

const styles = theme => ({
  stackbar: {
    backgroundColor: theme.circleIn.palette.snackbar,
    color: theme.circleIn.palette.primaryText1
  },
  container: {
    flexWrap: 'inherit'
  },
  title: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(),
    fontWeight: 700,
    fontSize: 28,
  },
  body: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing()
  },
  bodyList: {
    padding: theme.spacing(2, 0),
    marginBottom: theme.spacing()
  }
})

type Props = {
  classes: Object,
  enqueueSnackbar: Function,
  user: UserState
};

function reducer(state, action) {
  const { type } = action
  switch (type) {
  case 'INIT':
    return update(state, {
      tasks: { $set: action.tasks }
    })
  case 'ADD_TASK':
    return { ...state, tasks: [...state.tasks, { ...action.task }]}
  case 'ARCHIVE_TASK':
    return update(state, {
      tasks: {
        $splice: [
          [action.index, 1],
        ],
      }
    })
  case 'REORDER':
    return update(state, {
      tasks: {
        $splice: [
          [action.dragIndex, 1],
          [action.hoverIndex, 0, action.dragTask],
        ],
      }
    })
  case 'UPDATE_CATEGORY': {
    return update(state, {
      tasks: {
        [action.index]: {
          categoryId: { $set: action.categoryId },
        }
      }
    })
  }
  case 'UPDATE_ITEM':
    return update(state, {
      tasks: {
        [action.index]: {
          title: { $set: action.title },
          categoryId: { $set: action.categoryId || 0 },
          description: { $set: action.description || '' },
          date: { $set: action.date },
          sectionId: { $set: action.sectionId || '' },
          status: { $set: action.status }
        }
      }
    })
  case 'DRAG_UPDATE':
    return update(state, { dragId: { $set: action.dragId }})
  default:
    return state
  }
}

const initialState = {
  dragId: null,
  tasks: []
}

const Workflow = ({ user, enqueueSnackbar, classes }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { tasks, dragId } = state
  const [classList, setClassList] = useState({})
  const { data: { firstName }, userClasses } = user

  useEffect(() => {
    const init = async () => {
      const res = await getTodos()

      if (res) {
        dispatch({ type: 'INIT', tasks: res })
      } else {
        enqueueSnackbar(createSnackbar('Failed to initialize', classes.snackbar, 'error'))
      }
    }

    init()
  }, [dispatch, classes, enqueueSnackbar])

  const archiveTask = useCallback(async task => {
    const res = await archiveTodo({ id: task.id })
    if (res?.id) dispatch({ type: 'ARCHIVE_TASK', index: task.index })
  }, [dispatch])

  const moveTask = useCallback((dragIndex, hoverIndex) => {
    const dragTask = state.tasks[dragIndex]
    dispatch({ type: 'REORDER', dragIndex, hoverIndex, dragTask })
  }, [state, dispatch])

  const updateCategory = useCallback(async (index, categoryId) => {
    updateTodoCategory({ id: dragId, categoryId })
    dispatch({ type: 'UPDATE_CATEGORY', index, categoryId })
  }, [dispatch, dragId])

  const onDrag = useCallback(dragId => {
    dispatch({ type: 'DRAG_UPDATE', dragId })
  }, [dispatch])

  const [prevDragId, setprevDragId] = useState(null)
  useEffect(() => {
    const reorder = async () => {
      let ordering = []
      tasks.forEach((t, position) => {
        if (t.order !== position) {
          ordering = [...ordering, { id: t.id, position }]
        }
      })
      await updateTodosOrdering({ ordering })
    }
    if (dragId !== prevDragId && dragId === null) reorder()
    setprevDragId(dragId)
  }, [dragId, tasks, prevDragId])

  useEffect(() => {
    try{
      const classList = {}
      userClasses.classList.forEach(cl => {
        if (cl.section && cl.section.length > 0)
          cl.section.forEach(s => {
            classList[s.sectionId] = cl
          })
      })
      setClassList(classList)
    } finally {/* NONE */}
  },[userClasses])

  const [expanded, setExpanded] = useState([true, true, true, true])

  const handleExpand = useCallback(index => expand => {
    setExpanded(update(expanded, { [index-1]: { $set: expand } }))
  }, [expanded])


  const handleAddTask = useCallback(async title => {
    try {
      const res = await createTodo({ title })

      if (res?.id) {
        dispatch({
          type: 'ADD_TASK',
          task: {
            title,
            date: '',
            categoryId: 1,
            sectionId: '',
            order: tasks.length,
            id: res.id,
            status: 1
          }})

        handleExpand(1)(true)

        if (res?.points) enqueueSnackbar(createSnackbar(
          `Congratulations ${firstName}, you have just earned ${res.points} points. Good Work!`,
          classes.snackbar,
          'success'))
      }
    } catch(e) {
      enqueueSnackbar(createSnackbar('Failed to add task', classes.snackbar, 'error'))
    }
  }, [dispatch, handleExpand, enqueueSnackbar, classes, tasks, firstName])

  const updateItem = useCallback(async ({ index, title, date, categoryId, description, sectionId, id, status }) => {
    const res = await updateTodo({
      id,
      title,
      sectionId: Number(sectionId),
      categoryId: Number(categoryId),
      description,
      date: moment(date).valueOf(),
      status,
    })
    if (res?.success) {
      dispatch({ type: 'UPDATE_ITEM', index, title, date, categoryId, description, sectionId, status })
    } else {
      enqueueSnackbar(createSnackbar('Failed to update task', classes.snackbar, 'error'))
    }
  }, [dispatch, enqueueSnackbar, classes])

  return (
    <Grid container direction='column' spacing={0} className={classes.container}>
      <ErrorBoundary>
        <Typography
          color="textPrimary"
          className={classes.title}
        >
          Workflow - Manage all of your assignments in one place
        </Typography>
        <Paper elevation={0} className={classes.body}>
          <CreateWorkflow handleAddTask={handleAddTask} />
        </Paper>
        <Paper elevation={0} className={classes.bodyList}>
          <WorkflowList
            updateCategory={updateCategory}
            moveTask={moveTask}
            classList={classList}
            tasks={tasks}
            dragId={dragId}
            onDrag={onDrag}
            expanded={expanded}
            handleExpand={handleExpand}
            archiveTask={archiveTask}
            updateItem={updateItem}
          />
        </Paper>
      </ErrorBoundary>
    </Grid>
  )
}


const mapStateToProps = ({ user }: StoreState): {} => ({
  user,
})

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      enqueueSnackbar: notificationsActions.enqueueSnackbar,
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Workflow))
