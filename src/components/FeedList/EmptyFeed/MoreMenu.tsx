import React from 'react';

import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

type Props = {
  anchor: any;
  handleRemove: (...args: Array<any>) => any;
  completed: boolean;
  hide: boolean;
  toggleHide: (...args: Array<any>) => any;
  handleMenuClose: (...args: Array<any>) => any;
};

const MoreMenu = ({
  anchor,
  handleRemove,
  handleMenuClose,
  completed,
  hide,
  toggleHide
}: Props) => (
  <Menu
    disableAutoFocusItem
    anchorEl={anchor}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right'
    }}
    open={Boolean(anchor)}
    onClose={handleMenuClose}
    getContentAnchorEl={null}
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

export default MoreMenu;
