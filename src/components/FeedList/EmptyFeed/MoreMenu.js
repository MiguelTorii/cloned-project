// @flow

import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';

type Props = {
  anchor: Object,
  handleRemove: Function,
  completed: boolean,
  hide: boolean,
  toggleHide: Function,
  handleMenuClose: Function
};

const MoreMenu = ({
  anchor,
  handleRemove,
  handleMenuClose,
  completed,
  hide,
  toggleHide
}: Props) => {
  return (
    <Menu
      disableAutoFocusItem
      anchorEl={anchor}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={Boolean(anchor)}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={toggleHide}>
        <ListItemText inset primary={hide ? 'Expand' : 'Minimise'} />
      </MenuItem>
      {completed && (
        <MenuItem onClick={handleRemove}>
          <ListItemText inset primary="Remove from feed" />
        </MenuItem>
      )}
    </Menu>
  );
};

export default MoreMenu;
