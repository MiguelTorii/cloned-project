import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  storyContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    position: 'relative',
    [theme.breakpoints.up('s')]: {
      margin: theme.spacing(0, 4),
      flexDirection: 'row'
    },
    [theme.breakpoints.between('s', 'sm')]: {
      marginRight: 0
    }
  },
  storyAvatarContainer: {
    zIndex: 2,
    height: 70,
    width: 70,
    flexShrink: 0,
    [theme.breakpoints.up('s')]: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      left: -35
    },
    // TODO breakpoints is broken for Dialog, update MUI
    [theme.breakpoints.down(600)]: {
      transform: 'none',
      top: -5
    }
  },
  newStoryMessageContainer: {
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
    // TODO breakpoints is broken for Dialog, update MUI
    paddingTop: 50,
    marginTop: -35,
    [theme.breakpoints.up('s')]: {
      marginTop: 0,
      paddingTop: theme.spacing(2),
      paddingLeft: theme.spacing(4)
    }
  },
  storyMessageContainer: {
    overflow: 'hidden',
    flexGrow: 1,
    zIndex: 2
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
    color: theme.circleIn.palette.primaryText2,
    zIndex: 2,
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1 / 2),
    '&:hover': {
      backgroundColor: theme.circleIn.palette.primaryText1
    }
  }
}));
