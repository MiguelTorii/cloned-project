import { makeStyles } from '@material-ui/core/styles';

const ICON_WIDTH_PX = 70;

export const useStyles = makeStyles((theme: any) => ({
  storyContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    position: 'relative',
    padding: theme.spacing(1),
    [theme.breakpoints.up('s')]: {
      paddingLeft: theme.spacing(5),
      flexDirection: 'row'
    },
    [theme.breakpoints.between('s', 'sm')]: {
      marginRight: 0
    }
  },
  storyAvatarContainer: {
    zIndex: 2,
    height: ICON_WIDTH_PX,
    width: ICON_WIDTH_PX,
    flexShrink: 0,
    [theme.breakpoints.up('s')]: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      left: `calc(${theme.spacing(5)}px - ${ICON_WIDTH_PX / 2}px)`
    }
  },
  storyMessageContainer: {
    width: '100%',
    backgroundColor: theme.circleIn.palette.white,
    border: `solid 1px ${theme.circleIn.palette.success}`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflowX: 'hidden',
    overflowY: 'auto',
    fontSize: 18,
    color: 'black',
    padding: theme.spacing(2, 1),
    paddingTop: 50,
    marginTop: -(ICON_WIDTH_PX / 2),
    [theme.breakpoints.up('s')]: {
      marginTop: 0,
      paddingTop: theme.spacing(2),
      paddingLeft: theme.spacing(4)
    }
  },
  storyAvatarBackground: {
    background: theme.circleIn.palette.kobeBackground,
    borderRadius: '50%',
    padding: '10px 2px',
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  storyAvatar: {
    height: '100%'
  },
  storyMessage: {
    height: '100%',
    overflowX: 'hidden',
    overflowY: 'auto',
    color: 'black',
    fontSize: 18,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(1 / 2, 2)
  },
  closeIcon: {
    position: 'absolute',
    top: 2,
    right: 5,
    // TODO: Fix breakpoints, broken for Dialog, update MUI
    // Issue: https://github.com/mui-org/material-ui/issues/21745
    [theme.breakpoints.down(600)]: {
      top: ICON_WIDTH_PX / 2
    },
    color: theme.circleIn.palette.primaryBackground,
    cursor: 'pointer',
    zIndex: 2,
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1 / 2),
    '&:hover': {
      backgroundColor: theme.circleIn.palette.primaryText1
    }
  }
}));
