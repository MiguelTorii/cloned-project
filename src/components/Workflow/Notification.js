// @flow

import React, { useState, useCallback } from 'react'
import IconButton from '@material-ui/core/IconButton'
import { remiderTime } from 'constants/common'
import CloseIcon from '@material-ui/icons/Close'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import {makeStyles} from '@material-ui/core/styles'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import cx from 'classnames'

const useStyles = makeStyles(() => ({
  select: {
    width: 350
  },
  selectForm: {
    width: '100%',
    '& .MuiInput-formControl': {
      marginTop: 10,
    }
  },
  reminder: {
    '& .MuiInputLabel-outlined': {
      // transform: 'translate(14px, 13px) scale(1)'
    },
    '& .MuiOutlinedInput-input': {
      padding: '10.5px 16px'
    }
  },
  hidden: {
    display: 'none'
  }
}))

type Props = {
  dueDate: string,
  editNotification: Function,
  deleteNotification: Function,
  index: number,
  n: number
};

const Notification = ({
  dueDate,
  editNotification,
  deleteNotification,
  index,
  n
}: Props) => {
  const classes= useStyles()
  const [open, setOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(n.value || '')

  const openSelect = useCallback(() => setOpen(true), [])
  const closeSelect = useCallback(() => setOpen(false), [])

  const menuComponent = useCallback((hidden) => {
    const valid = moment(currentDate)._isValid
    return (
      <MenuItem key={`custom-time-${hidden}`} value={n.key.includes('custom') ? n.key : 'custom'} className={cx(hidden && classes.hidden)}>
        {valid ? moment(currentDate).format('LLLL') : 'Custom'}
      </MenuItem>
    )}, [currentDate, classes, n])

  const updateCustomDate = useCallback((d, e) => {
    const isDate = Boolean(e?.target)
    const cur = currentDate || new Date()
    const time = moment(isDate ? cur : d).format('HH:mm:ss')
    const date = moment(isDate ? d : cur).format('YYYY-MM-DD')
    setCurrentDate(new Date(`${date} ${time}`))
    if (!isDate) {
      editNotification({ target: { key: 'custom', value: new Date(`${date} ${time}`) } }, index)
      closeSelect()
    }
  }, [currentDate, index, editNotification, closeSelect])

  return (
    <FormControl className={classes.selectForm}>
      <Grid container alignItems='center'>
        <Select
          className={classes.select}
          value={n.key}
          open={open}
          onOpen={openSelect}
          onClose={closeSelect}
          onChange={value => editNotification(value, index)}
        >
          {Object.keys(remiderTime).map(w => (
            <MenuItem key={`time-${w}`} value={w}>{remiderTime[w].label}</MenuItem>
          ))}
          {menuComponent(true)}
          <DatePicker
            selected={currentDate}
            onChange={updateCustomDate}
            showTimeSelect
            timeFormat="HH:mm"
            maxDate={dueDate}
            minDate={new Date()}
            timeIntervals={30}
            timeCaption="Time"
            dateFormat="MMMM d, yyyy h:mm aa"
            customInput={menuComponent(false)}
          />
        </Select>
        <IconButton edge="start" color="inherit" aria-label="close" onClick={() => deleteNotification(index)}>
          <CloseIcon fontSize='small' />
        </IconButton>
      </Grid>
    </FormControl>
  )
}

export default Notification
