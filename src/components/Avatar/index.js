import React, { useMemo } from 'react';
import { Avatar as MuiAvatar } from '@material-ui/core';
import withRoot from '../../withRoot';
import { useStyles } from '../_styles/Avatar';

export const DEFAULT_AVATAR_SIZE = {
  desktop: 124,
  mobile: 60
};

type Props = {
  src: string,
  initialText?: string,
  desktopSize?: number,
  mobileSize?: number
};

const Avatar = ({ src, initialText, mobileSize, desktopSize }: Props) => {
  const classes = useStyles({ mobileSize, desktopSize });
  const avatarUrl = useMemo(() => {
    if (src instanceof Blob) {
      return window.URL.createObjectURL(src);
    }
    return src;
  }, [src]);

  return (
    <MuiAvatar
      src={avatarUrl}
      className={classes.avatar}
    >
      { initialText }
    </MuiAvatar>
  );
};

export default withRoot(Avatar);
