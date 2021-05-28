import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'flex-start',
    width: '100%',
    height: '100%'
  },
  container: {
    position: 'relative',
    height: 'inherit'
  },
  collageList: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
    width: 70,
    height: '100%'
  },
  directChat: {
    width: 'calc(100% - 70px)',
    height: '100%'
  },
  main: {
    display: 'flex',
    position: 'relative',
    borderLeft: '1px solid rgba(255,255,255,0.15)',
    borderRight: '1px solid rgba(255,255,255,0.15)',
    height: '100%',
  },
  rightDrawerClose: {
    right: 0,
  },
  rightDrawerOpen: {
    right: '24%',
    [theme.breakpoints.down('xs')]: {
      right: '48%'
    }
  },
  right: {
    height: '100%',
    overflow: 'auto',
  },
  hidden: {
    border: 'none',
    display: 'none'
  },
  left: {
    backgroundColor: theme.circleIn.palette.navbarBackgroundColor,
    border: `1px solid ${theme.circleIn.palette.navbarBorderColor}`,
    boxSizing: 'border-box'
  },
  loading: {
    height: '100%'
  },
  expandButton: {
    position: 'absolute',
    width: 40,
    height: 40,
    backgroundColor: theme.circleIn.palette.modalBackground,
    border: '5px solid #28292C',
    '&:hover, &:active': {
      background: 'linear-gradient(115.22deg, #94DAF9 -9.12%, #1E88E5 90.34%)'
    }
  },
  sidebarButton: {
    top: 40,
    left: '16.4%',
    zIndex: 1002,
    transform: 'translateX(-50%)',
    [theme.breakpoints.down('md')]: {
      left: '33%'
    },
    [theme.breakpoints.down('xs')]: {
      left: '92%'
    }
  },
  bodyButton: {
    top: 40,
    left: 0,
    zIndex: 1002
  }
}))

export default useStyles