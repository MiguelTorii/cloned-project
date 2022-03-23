import React, { memo } from 'react';

import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ChatIcon from '@material-ui/icons/Chat';
import NotificationsIcon from '@material-ui/icons/Notifications';

import Avatar from 'components/Avatar';

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
}) => (
  <Menu
    anchorEl={mobileMoreAnchorEl}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right'
    }}
    open={isMobileMenuOpen}
    onClose={handleMobileMenuClose}
    getContentAnchorEl={null}
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
      <Avatar profileImage={userProfileUrl} initials={initials} fromChat />
      <p>Account</p>
    </MenuItem>
  </Menu>
);

export default memo(MobileMenu);
