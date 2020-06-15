// @flow
import React, { forwardRef, useState } from 'react'
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
    '& .react-datepicker-popper': {
      width: 330
    },
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

const locale = navigator.languages !== undefined ? navigator.languages[0] : navigator.language

const  DateInputComponent = forwardRef((props) => {
  const { component: Component, inputRef, ...other } = props;
  // eslint-disable-next-line
  return <Component {...other} ref={(ref) => inputRef(ReactDOM.findDOMNode(ref))} />;
})

type Props = {
  onChange: Function,
  selected: Object,
  style: Object
};

const DateInput = ({ onChange, selected, fixed, style }: Props) => {
  const classes = useStyles()
  const [time, setTime] = useState(selected)
  const [date, setDate] = useState(selected)

  const handleDate = v => {
    const date = moment(v).format('YYYY-MM-DD')
    const newTime = moment(time || new Date()).utc().format('HH:mm')
    setDate(v)
    onChange(moment(`${date}T${newTime}Z`).utc().toDate())
  }

  const handleTime = v => {
    const time = moment.utc(v).format('HH:mm')
    setTime(v)
    const newDate = moment(date || new Date()).format('YYYY-MM-DD')
    onChange(moment.utc(`${newDate} ${time}`).toDate())
  }

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
              locale,
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
