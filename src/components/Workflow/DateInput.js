// @flow
import React, { useCallback } from 'react';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import { DatePicker, TimePicker } from '@material-ui/pickers';

type Props = {
  onChange: Function,
  selected: Object,
  style: Object
};

const DateInput = ({ onChange, selected, style }: Props) => {
  const handleChangeDateTime = useCallback(
    (date) => {
      onChange(date.format('YYYY-MM-DD HH:mm:ss'));
    },
    [onChange]
  );

  return (
    <Grid container spacing={2} style={style}>
      <Grid item xs={6}>
        <DatePicker
          autoOk
          disabledToolbar
          variant="inline"
          inputVariant="outlined"
          label="Due Date"
          format="YYYY-MM-DD"
          size="small"
          value={selected ? moment(selected) : null}
          onChange={handleChangeDateTime}
          InputLabelProps={{
            shrink: true
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <TimePicker
          autoOk
          variant="inline"
          inputVariant="outlined"
          label="Time"
          size="small"
          value={selected ? moment(selected) : null}
          onChange={handleChangeDateTime}
          InputLabelProps={{
            shrink: true
          }}
        />
      </Grid>
    </Grid>
  );
};

export default DateInput;
