// @flow
import React, { memo } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

const TopMenu = ({
  anchorEl,
  isMenuOpen,
  handleMenuClose,
  handleBlockedUsers,
  handleOpenReferralStatus,
  handleManageClasses,
  userClasses,
  MyLink,
  userId,
  handleSignOut,
  search
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem component={MyLink} link={`/profile/${userId}${search}`}>
        My Profile
      </MenuItem>
      {userClasses.canAddClasses && (
        <MenuItem onClick={handleManageClasses}>Add/Remove Classes</MenuItem>
      )}
      <MenuItem onClick={handleBlockedUsers}>Unblock Users</MenuItem>
      <MenuItem onClick={handleOpenReferralStatus}>
        Referred Classmates
      </MenuItem>
      <MenuItem onClick={handleSignOut}>Logout</MenuItem>
    </Menu>
  );
};

export default memo(TopMenu);
