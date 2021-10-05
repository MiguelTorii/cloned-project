import { makeStyles } from '@material-ui/core';

export const DEFAULT_AVATAR_SIZE = {
  desktop: 124,
  mobile: 60
};
export const useStyles = makeStyles((theme: any) => ({
  avatar: {
    [theme.breakpoints.down('sm')]: {
      width: (props: any) => props.mobileSize || DEFAULT_AVATAR_SIZE.mobile,
      height: (props: any) => props.mobileSize || DEFAULT_AVATAR_SIZE.mobile
    },
    [theme.breakpoints.up('md')]: {
      width: (props: any) => props.desktopSize || DEFAULT_AVATAR_SIZE.desktop,
      height: (props: any) => props.desktopSize || DEFAULT_AVATAR_SIZE.desktop
    },
    fontSize: theme.typography.h4.fontSize
  }
}));
