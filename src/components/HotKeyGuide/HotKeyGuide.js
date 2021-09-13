import React from 'react';
import { Tooltip } from '@material-ui/core';
import PropTypes from 'prop-types';
import HotKeyIcon from '../HotKeyIcon/HotKeyIcon';
import HotKeyBox from '../HotKeyBox/HotKeyBox';
import useStyles from './styles';

const HotKeyGuide = ({ data }) => {
  const classes = useStyles();

  return (
    <Tooltip
      title={<HotKeyBox data={data} />}
      arrow
      placement="top"
      classes={{
        popper: classes.popper
      }}
    >
      <HotKeyIcon />
    </Tooltip>
  );
};

HotKeyGuide.propTypes = {
  data: PropTypes.array.isRequired
};

export default HotKeyGuide;
