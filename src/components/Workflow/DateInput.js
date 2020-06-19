// @flow
import React, { useCallback, useEffect, forwardRef, useState } from 'react'
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import DatePicker from 'react-datepicker'
import cx from 'classnames'
import InputAdornment from '@material-ui/core/InputAdornment'
import moment from 'moment'

import 'react-datepicker/dist/react-datepicker.css'

const useStyles = makeStyles(theme => ({
  fixed: {
    '& .react-datepicker-popper': {
      position: 'fixed !important',
      top: 'auto !important',
      left: 'auto !important',
      transform: 'translate3d(-150px, 30px, 100px) !important',
    },
  },
  datePicker: {
    '& .MuiInputBase-input': {
      paddingLeft: theme.spacing(),
      paddingRight: theme.spacing()
    },
    '& .MuiOutlinedInput-adornedStart': {
      padding: 0
    },
    '& .MuiInputAdornment-positionStart': {
      marginRight: 0
    },
    zIndex: 2
  }
}))

// eslint-disable-next-line
const  DateInputComponent = forwardRef((props, ref) => {
  const { component: Component, inputRef, ...other } = props;
  // eslint-disable-next-line
  return <Component {...other} ref={(ref) => inputRef(ReactDOM.findDOMNode(ref))} />;
})

type Props = {
  onChange: Function,
  selected: Object,
  style: Object
};

const getTime = date => {
  const time = moment(date)
  const format = time.format('HH:mm:ss')
  return time._isValid ? format : ''
}
const getDate = date => {
  const newDate = moment(date)
  const format = newDate.format('YYYY-MM-DD')
  return newDate._isValid ? format : ''
}

const DateInput = ({ onChange, selected, fixed, style }: Props) => {
  const classes = useStyles()
  const [time, setTime] = useState(getTime(selected))
  const [date, setDate] = useState(getDate(selected))

  const handleDate = useCallback(v => {
    const date = getDate(v)
    setDate(date)
  }, [])

  const handleTime = useCallback(v => {
    const time = getTime(v)
    setTime(time)
  }, [])

  useEffect(() => {
    try {
      if (date || time) {
        const nowDate = moment().format('YYYY-MM-DD')
        const nowTime = moment().format('HH:mm:ss')
        onChange(moment(`${date || nowDate} ${time || nowTime}`).toDate())
      }
    } finally {/* NO-OP */}
  }, [date, time, onChange])

  return (
    <Grid container spacing={2} style={style}>
      <Grid item xs={6}>
        <TextField
          size='small'
          fullWidth
          variant='outlined'
          label='Due Date'
          className={cx(classes.datePicker, fixed && classes.fixed)}
          InputProps={{
            startAdornment: <InputAdornment position='start'><div /></InputAdornment>,
            inputComponent: DateInputComponent,
            inputProps: {
              component: DatePicker,
              selected,
              onChange: handleDate,
              dateFormat: 'MM/dd/yyyy',
            },
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          size='small'
          fullWidth
          variant='outlined'
          label='Time'
          className={cx(classes.datePicker, fixed && classes.fixed)}
          InputProps={{
            startAdornment: <InputAdornment position='start'><div /></InputAdornment>,
            inputComponent: DateInputComponent,
            inputProps: {
              component: DatePicker,
              selected,
              onChange: handleTime,
              showTimeSelectOnly: true,
              showTimeSelect: true,
              timeIntervals: 15,
              timeCaption: 'Time',
              dateFormat: 'p',
            },
          }}
        />
      </Grid>
    </Grid>
  )
}

export default DateInput
