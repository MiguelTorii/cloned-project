import React, { memo } from 'react';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import useStyles from '../_styles/MainLayout/TopMenu';

const TopMenu = ({
  anchorEl,
  isMenuOpen,
  handleMenuClose,
  handleBlockedUsers,
  expertMode,
  handleOpenHowEarnPoints,
  MyLink,
  userId,
  handleSignOut,
  search
}) => {
  const classes: any = useStyles();
  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      classes={{
        paper: classes.menuPaper,
        list: classes.avatarMenu
      }}
      getContentAnchorEl={null}
    >
      <MenuItem component={MyLink} link={`/profile/${userId}${search}`}>
        My Profile
      </MenuItem>
      <MenuItem onClick={handleBlockedUsers}>Unblock Classmates</MenuItem>
      <MenuItem onClick={handleOpenHowEarnPoints}>
        {expertMode ? 'Expert Mode Support Center' : 'Student Help Center'}
      </MenuItem>
      <MenuItem onClick={handleSignOut}>Logout</MenuItem>
    </Menu>
  );
};

export default memo(TopMenu);
