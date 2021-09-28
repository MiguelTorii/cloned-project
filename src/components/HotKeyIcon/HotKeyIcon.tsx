import React from 'react';
import { Box } from '@material-ui/core';
import IconKeyboardOutlined from '@material-ui/icons/KeyboardOutlined';
import useStyles from './styles';

const HotKeyIcon = (props, ref) => {
  const classes: any = useStyles();
  return (
    <Box {...props} ref={ref} className={classes.root}>
      <IconKeyboardOutlined className={classes.icon} />
    </Box>
  );
};

export default React.forwardRef(HotKeyIcon);
