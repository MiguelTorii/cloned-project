import React, { useMemo } from 'react';
import { Avatar as MuiAvatar, Box } from '@material-ui/core';

import { UserAvatar } from 'types/models';
import OnlineBadge from 'components/OnlineBadge';
import { getInitials } from 'utils/chat';
import { useStyles } from 'components/Avatar/AvatarStyles';

const Avatar = ({
  profileImage,
  mobileSize,
  desktopSize,
  fullName,
  isOnline,
  hasOnlineBadge,
  handleUserClick,
  onlineBadgeBackground,
  fromChat,
  initials,
  isVisible
}: UserAvatar) => {
  const classes = useStyles({
    mobileSize,
    desktopSize
  });

  const avatarUrl = useMemo(() => {
    if (profileImage instanceof Blob) {
      return window.URL.createObjectURL(profileImage);
    }

    return profileImage;
  }, [profileImage]);

  const userName = initials ? initials : getInitials(fullName);

  const renderAvatar = () => (
    <Box onClick={handleUserClick} className={classes.profileBackground}>
      <div className={classes.avatarContainer}>
        {profileImage ? <MuiAvatar className={classes.profileImage} src={avatarUrl} /> : userName}
      </div>
    </Box>
  );

  return hasOnlineBadge || onlineBadgeBackground ? (
    <OnlineBadge
      isVisible={isVisible}
      isOnline={isOnline}
      bgColorPath={onlineBadgeBackground}
      fromChat={fromChat}
    >
      {renderAvatar()}
    </OnlineBadge>
  ) : (
    <>{renderAvatar()}</>
  );
};

export default Avatar;
