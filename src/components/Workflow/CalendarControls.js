import React, {useMemo, useCallback, useEffect, useState} from 'react'
import Grid from '@material-ui/core/Grid'
import {makeStyles} from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import Typography from '@material-ui/core/Typography'
// import CalendarEmptyDateTasks from 'components/Workflow/CalendarEmptyDateTasks'

const useStyles = makeStyles((theme) => ({
  container: {
    marginBottom: theme.spacing()
  },
  button: {
    fontSize: 18,
    padding: theme.spacing(1, 2)
  },
  today: {
    fontWeight: 'bold',
    marginLeft: theme.spacing()
  },
  iconButton: {
    padding: theme.spacing(),
    '& .MuiSvgIcon-root': {
      fontSize: 20
    }
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
  },
  titleContainer: {
    position: 'relative'
  },
}))

const CalendarControls = ({
  // currentCalendarView,
  // onOpenEdit,
  // tasksEmptyDate,
  calendar,
}) => {
  const [api, setApi] = useState(null)
  const [title, setTitle] = useState('')
  // const [currentView, setCurrentView] = useState(currentCalendarView)
  const classes = useStyles()

  useEffect(() => {
    if (calendar) {
      const api = calendar.getApi()
      setApi(api)
      setTitle(api?.view?.title)
    }
  }, [calendar])

  const next = useCallback(() => {
    if (api) {
      api.next()
      setTitle(api?.view?.title)
    }
  }, [api])

  const previous = useCallback(() => {
    if (api) {
      api.prev()
      setTitle(api?.view?.title)
    }
  }, [api])

  // const changeView = useCallback(view => () => {
  // if (api) {
  // api.changeView(view)
  // setCurrentView(view)
  // setTitle(api?.view?.title)
  // }
  // }, [api])

  const today = useCallback(() => {
    if (api) {
      api.today()
      setTitle(api?.view?.title)
    }
  }, [api])

  const todayDisabled = useMemo(() => {
    if (api && title) {
      const now = new Date()
      return api.view.activeStart < now && now < api.view.activeEnd
    }
    return true
  }, [api, title])

  return (
    <Grid className={classes.container} container justify='space-between'>
      <Grid item xs={4}>
        <IconButton
          aria-label='previous'
          className={classes.iconButton}
          onClick={previous}
        >
          <ArrowBackIosIcon />
        </IconButton>
        <IconButton
          aria-label='next'
          className={classes.iconButton}
          onClick={next}
        >
          <ArrowForwardIosIcon />
        </IconButton>
        <Button
          aria-label='today'
          onClick={today}
          className={classes.today}
          variant='contained'
          color='primary'
          disabled={todayDisabled}
        >
          Today
        </Button>
      </Grid>
      {/* <Grid item> */}
      {/* <Button */}
      {/* aria-label='month view' */}
      {/* className={classes.button} */}
      {/* color={currentView === 'dayGridMonth' ? 'primary' : 'default'} */}
      {/* onClick={changeView('dayGridMonth')} */}
      {/* > */}
      {/* Month */}
      {/* </Button> */}
      {/* <Button */}
      {/* aria-label='week view' */}
      {/* className={classes.button} */}
      {/* color={currentView === 'timeGridWeek' ? 'primary' : 'default'} */}
      {/* onClick={changeView('timeGridWeek')} */}
      {/* > */}
      {/* Week */}
      {/* </Button> */}
      {/* <Button */}
      {/* aria-label='day view' */}
      {/* className={classes.button} */}
      {/* color={currentView === 'timeGridDay' ? 'primary' : 'default'} */}
      {/* onClick={changeView('timeGridDay')} */}
      {/* > */}
      {/* Day */}
      {/* </Button> */}
      {/* <Button */}
      {/* aria-label='list view' */}
      {/* className={classes.button} */}
      {/* color={currentView === 'listMonth' ? 'primary' : 'default'} */}
      {/* onClick={changeView('listMonth')} */}
      {/* > */}
      {/* List */}
      {/* </Button> */}
      {/* </Grid> */}
      <Grid item xs={4} className={classes.titleContainer}>
        {/* {tasksEmptyDate.length > 0 && */}
        {/* <CalendarEmptyDateTasks tasksEmptyDate={tasksEmptyDate} onOpenEdit={onOpenEdit} /> */}
        {/* } */}
        <Typography className={classes.title}>{title}</Typography>
      </Grid>
      <Grid item xs={4} />
    </Grid >
  )
}

export default CalendarControls
