import React, { useMemo, useState, useCallback } from 'react';

import moment from 'moment';

import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import CloseIcon from '@material-ui/icons/Close';

import { remiderTime } from 'constants/common';

import { useStyles } from '../_styles/Workflow/Notification';

type Props = {
  dueDate?: string;
  editNotification?: (...args: Array<any>) => any;
  deleteNotification?: (...args: Array<any>) => any;
  index?: number;
  n?: any;
};

const Notification = ({ dueDate, editNotification, deleteNotification, index, n }: Props) => {
  const classes: any = useStyles();
  const [open, setOpen] = useState(false);
  const openSelect = useCallback(() => setOpen(true), []);
  const closeSelect = useCallback(() => setOpen(false), []);
  const options = useMemo(() => {
    const opts = {};
    const dueMoment = moment(dueDate);
    Object.keys(remiderTime).forEach((rt) => {
      const { value } = remiderTime[rt];

      if (value < dueMoment.valueOf() / 1000 - moment().valueOf() / 1000) {
        opts[rt] = remiderTime[rt];
      }
    });
    return opts;
  }, [dueDate]);

  return (
    <FormControl className={classes.selectForm}>
      <Grid container alignItems="center">
        <Select
          className={classes.select}
          value={n.key}
          open={open}
          onOpen={openSelect}
          onClose={closeSelect}
          onChange={(value) => editNotification(value, index)}
        >
          {Object.keys(options).map((w) => (
            <MenuItem key={`time-${w}`} value={w}>
              {remiderTime[w].label}
            </MenuItem>
          ))}
        </Select>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="close"
          onClick={() => deleteNotification(index)}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Grid>
    </FormControl>
  );
};

export default Notification;
