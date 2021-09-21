import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import { twoDigitsNumber } from 'utils/helpers';
import MenuItem from '@material-ui/core/MenuItem';
import useStyles from './styles';

const NumberSelector = ({ value, limit, onChange }) => {
  const classes = useStyles();

  const options = useMemo(() => [...new Array(limit + 1).keys()].map((index) => ({
      text: twoDigitsNumber(index),
      value: index + 1
    })), [limit]);

  return (
    <Select
      value={value + 1}
      onChange={(ev) => onChange(ev.target.value - 1)}
      className={classes.timerSelect}
    >
      {options.map((item) => (
        <MenuItem key={item.value} value={item.value}>
          {item.text}
        </MenuItem>
      ))}
    </Select>
  );
};

NumberSelector.propTypes = {
  value: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
};

export default NumberSelector;
