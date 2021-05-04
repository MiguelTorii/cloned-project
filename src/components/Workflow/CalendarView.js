import React, { useContext, useRef, useEffect, useState, useCallback } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from "@fullcalendar/interaction"
import { workflowCategories } from 'constants/common'
import WorkflowEdit from 'components/Workflow/WorkflowEdit'
import Dialog from 'components/Dialog'
import Typography from '@material-ui/core/Typography'
import CalendarControls from 'components/Workflow/CalendarControls'
import WorkflowContext from 'containers/Workflow/WorkflowContext'
import { useStyles } from '../_styles/Workflow/CalendarView'

const CalendarView = () => {
  const {
    tasks,
    archiveTask,
    setCurrentCalendarView,
    updateItem,
    currentCalendarView,
  } = useContext(WorkflowContext)
  const classes = useStyles()
  const [calendarTasks, setCalendarTasks] = useState([])
  const [currentTask, setCurrentTask] = useState(null)
  const [confirmArchive, setConfirmArchive] = useState(false)
  const calendarRef = useRef(null)
  const openConfirmArchive = useCallback(() => {
    setConfirmArchive(true)
  }, [])
  const [tasksEmptyDate, setTasksEmptyDate] = useState([])

  const closeConfirmArchive = useCallback(() => setConfirmArchive(false), [])

  const onOpenEdit = useCallback(e => {
    const { event: { extendedProps: { index } } } = e
    const task = tasks[index]
    setCurrentTask({ ...task, index })
  }, [tasks])

  const onCloseEdit = useCallback(() => setCurrentTask(null), [])

  const archive = useCallback(async () => {
    await archiveTask(currentTask)
    closeConfirmArchive()
    setTimeout(() => setCurrentTask(null), 100)
    onCloseEdit()
  }, [currentTask, archiveTask, closeConfirmArchive, onCloseEdit])

  useEffect(() => {
    const calendarTasks = tasks.map((t, index) => {
      const date = typeof t.date.getMonth === 'function' ? t.date : new Date(`${t.date.replace(' ', 'T')}Z`)

      return {
        ...t,
        date,
        backgroundColor: workflowCategories[t.categoryId - 1].bgcolor,
        index
      }
    })

    const tasksEmptyDate = calendarTasks
      .filter(t => String(t.date) === 'Invalid Date')
      .map(t => ({
        ...t,
        create: false,
      }))

    setTasksEmptyDate(tasksEmptyDate)
    setCalendarTasks(calendarTasks)
  }, [tasks])

  const onDrop = useCallback(async e => {
    const { event: { start, extendedProps: { index } } } = e
    await updateItem({ ...tasks[index], date: start, index })
  }, [updateItem, tasks])

  const onViewChange = useCallback(e => {
    if (e?.view?.type) setCurrentCalendarView(e?.view?.type)
  }, [setCurrentCalendarView])

  const onExternalDrop = useCallback(async e => {
    if (e?.dateStr && e?.draggedEl?.dataset?.event) {
      const task = JSON.parse(e?.draggedEl?.dataset?.event)
      const date = new Date(e.dateStr.includes('T') ? e.dateStr : `${e.dateStr} 12:00:00`)
      await updateItem({ ...task, date })
    }
  }, [updateItem])

  const [doubleClick, setDoubleClick] = useState(null)

  const addTask = useCallback(() => {
    setCurrentTask({
      categoryId: 1,
      date: doubleClick ? new Date(`${doubleClick} 12:00:00`) : '',
      id: -1,
      sectionId: '',
      status: 1,
      order: -1,
    })
  }, [doubleClick])

  const onDateClick = useCallback(e => {
    const { dateStr } = e
    if (!doubleClick) {
      setDoubleClick(dateStr)
      setTimeout(() => setDoubleClick(null), 1000)
    }

    if (doubleClick === dateStr) addTask()
  }, [addTask, doubleClick])

  return (
    <div className={classes.root}>
      {currentTask && <Dialog
        className={classes.dialog}
        onCancel={closeConfirmArchive}
        open={confirmArchive}
        onOk={archive}
        showActions
        title='Are you sure you want to delete?'
        okTitle='Delete'
        showCancel
      >
        <Typography className={classes.archiveTitle}>{currentTask && currentTask.title}</Typography>
      </Dialog>}
      {currentTask && <WorkflowEdit
        task={currentTask}
        openConfirmArchive={openConfirmArchive}
        onClose={onCloseEdit}
        open
      />}
      <CalendarControls
        calendar={calendarRef.current}
        addTask={addTask}
        currentCalendarView={currentCalendarView}
        tasksEmptyDate={tasksEmptyDate}
        onOpenEdit={onOpenEdit}
      />
      <FullCalendar
        viewDidMount={onViewChange}
        ref={calendarRef}
        themeSystem='bootstrap'
        slotMinTime='06:00:00'
        slotMaxTime='20:00:00'
        defaultTimedEventDuration='00:00'
        drop={onExternalDrop}
        eventDrop={onDrop}
        eventClick={onOpenEdit}
        dateClick={onDateClick}
        allDaySlot={false}
        editable
        contentHeight='auto'
        dayMaxEventRows
        views={{
          dayGrid: {
            dayMaxEventRows: 3
          }
        }}
        droppable
        eventDurationEditable={false}
        initialView={currentCalendarView}
        nowIndicator
        headerToolbar={{
          left: '',
          center: '',
          right: ''
        }}
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin]}
        events={calendarTasks}
      />
    </div>
  )
}

export default CalendarView
