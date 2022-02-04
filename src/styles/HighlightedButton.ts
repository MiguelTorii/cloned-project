import { alpha, makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme: any) => ({
  default: {
    boxShadow: `0 0 0 ${theme.spacing(1)}px ${theme.circleIn.palette.success}`
  },
  animated: {
    animation: '$pulse 2s infinite',
    position: 'relative',
    '&:before': {
      zIndex: 2,
      content: '""',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      boxShadow: `0 0 0 5px inset ${theme.circleIn.palette.success}`
    }
  },
  '@keyframes pulse': {
    '0%': {
      boxShadow: `0 0 0 0 ${alpha(theme.circleIn.palette.success, 0.5)}`
    },
    '70%': {
      boxShadow: `0 0 0 ${theme.spacing(2)}px ${alpha(theme.circleIn.palette.success, 0)}`
    },
    '100%': {
      boxShadow: `0 0 0 0 ${alpha(theme.circleIn.palette.success, 0)}`
    }
  }
}));
