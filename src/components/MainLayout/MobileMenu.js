// @flow
import React, { memo } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Menu from '@material-ui/core/Menu';
import Avatar from '@material-ui/core/Avatar';
import ChatIcon from '@material-ui/icons/Chat';

const MobileMenu = ({
  mobileMoreAnchorEl,
  MyLink,
  isMobileMenuOpen,
  handleMobileMenuClose,
  handleNotificationOpen,
  open,
  unreadMessages,
  width,
  unreadCount,
  handleProfileMenuOpen,
  initials,
  userProfileUrl
}) => {
  return (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {width !== 'xs' && (
        <MenuItem
          onClick={handleNotificationOpen}
          aria-haspopup="true"
          aria-owns={open ? 'notifications-popper' : undefined}
        >
          <IconButton color="inherit">
            <Badge badgeContent={unreadCount} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
      )}
      <MenuItem button component={MyLink} link="/chat">
        <IconButton color="inherit">
          <Badge badgeContent={unreadMessages} color="secondary">
            <ChatIcon />
          </Badge>
        </IconButton>
        <p>Chats</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton color="inherit">
          <Avatar src={userProfileUrl}>{initials}</Avatar>
        </IconButton>
        <p>Account</p>
      </MenuItem>
    </Menu>
  );
};

export default memo(MobileMenu);
