import React, { useMemo } from 'react';
import { makeStyles, Avatar as MuiAvatar } from '@material-ui/core';
import withRoot from '../../withRoot';

export const DEFAULT_AVATAR_SIZE = {
  desktop: 124,
  mobile: 60
};

const useStyles = makeStyles((theme) => ({
  avatar: {
    [theme.breakpoints.down('sm')]: {
      width: (props) => props.mobileSize || DEFAULT_AVATAR_SIZE.mobile,
      height: (props) => props.mobileSize || DEFAULT_AVATAR_SIZE.mobile
    },
    [theme.breakpoints.up('md')]: {
      width: (props) => props.desktopSize || DEFAULT_AVATAR_SIZE.desktop,
      height: (props) => props.desktopSize || DEFAULT_AVATAR_SIZE.desktop
    },
    fontSize: theme.typography.h2.fontSize
  }
}));

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
