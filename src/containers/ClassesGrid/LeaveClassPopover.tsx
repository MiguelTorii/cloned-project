import React from 'react';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

type Props = {
  handleClose?: (...args: Array<any>) => any;
  anchorEl?: any;
  leaveClass?: (...args: Array<any>) => any;
};

const LeaveClassPopover = ({ anchorEl, leaveClass, handleClose }: Props) => {
  const handleLeave = (event) => {
    leaveClass();
    handleClose(event);
  };

  return (
    <Menu
      anchorEl={anchorEl}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <MenuItem onClick={handleLeave}>Leave the Class</MenuItem>
    </Menu>
  );
};

export default LeaveClassPopover;
