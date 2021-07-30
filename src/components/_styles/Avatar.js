import { makeStyles } from '@material-ui/core';
export const DEFAULT_AVATAR_SIZE = {
  desktop: 124,
  mobile: 60
};

export const useStyles = makeStyles((theme) => ({
  avatar: {
    [theme.breakpoints.down('sm')]: {
      width: (props) => props.mobileSize || DEFAULT_AVATAR_SIZE.mobile,
      height: (props) => props.mobileSize || DEFAULT_AVATAR_SIZE.mobile
    },
    [theme.breakpoints.up('md')]: {
      width: (props) => props.desktopSize || DEFAULT_AVATAR_SIZE.desktop,
      height: (props) => props.desktopSize || DEFAULT_AVATAR_SIZE.desktop
    },
    fontSize: theme.typography.h4.fontSize
  }
}));
