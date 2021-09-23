// @flow

import React, { useCallback, forwardRef, useState } from 'react';
import ReactDOM from 'react-dom';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import DatePicker from 'react-datepicker';
import cx from 'classnames';
import InputAdornment from '@material-ui/core/InputAdornment';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import { useStyles } from '../_styles/Workflow/DateInput';

const DateInputComponent = forwardRef((props, ref) => {
  const { component: Component, inputRef, ...other } = props;
  return (
    <Component {...other} ref={(ref) => inputRef(ref)} />
  );
});

type Props = {
  onChange: Function,
  selected: Object,
  style: Object
};

const getTime = (date) => {
  const time = moment(date);
  const format = time.format('HH:mm:ss');
  return time._isValid ? format : '';
};
const getDate = (date) => {
  const newDate = moment(date);
  const format = newDate.format('YYYY-MM-DD');
  return newDate._isValid ? format : '';
};

const DateInput = ({ onChange, selected, fixed, style }: Props) => {
  const classes = useStyles();

  const handleDate = useCallback(
    (v) => {
      const date = getDate(v);
      const nowTime = moment().format('HH:mm:ss');
      if (date) {
        onChange(
          moment(`${date} ${getTime(selected) || nowTime}`, 'YYYY-MM-DD HH:mm:ss').toDate()
        );
      }
    },
    [onChange, selected]
  );

  const handleTime = useCallback(
    (v) => {
      const time = getTime(v);
      const nowDate = moment().format('YYYY-MM-DD');
      if (time) {
        onChange(
          moment(`${getDate(selected) || nowDate} ${time}`, 'YYYY-MM-DD HH:mm:ss').toDate()
        );
      }
    },
    [onChange, selected]
  );

  return (
    <Grid container spacing={2} style={style}>
      <Grid item xs={6}>
        <TextField
          size="small"
          fullWidth
          variant="outlined"
          label="Due Date"
          className={cx(classes.datePicker, fixed && classes.fixed)}
          InputProps={{
            inputComponent: DateInputComponent,
            inputProps: {
              component: DatePicker,
              selected,
              onChange: handleDate,
              dateFormat: 'MM/dd/yyyy'
            }
          }}
          InputLabelProps={{
            shrink: true
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          size="small"
          fullWidth
          variant="outlined"
          label="Time"
          className={cx(classes.datePicker, fixed && classes.fixed)}
          InputProps={{
            inputComponent: DateInputComponent,
            inputProps: {
              component: DatePicker,
              selected,
              onChange: handleTime,
              showTimeSelectOnly: true,
              showTimeSelect: true,
              timeIntervals: 15,
              timeCaption: 'Time',
              dateFormat: 'p'
            }
          }}
          InputLabelProps={{
            shrink: true
          }}
        />
      </Grid>
    </Grid>
  );
};

export default DateInput;
