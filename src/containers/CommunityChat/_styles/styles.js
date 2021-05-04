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
  leftDrawerClose: {
    left: 0,
  },
  leftDrawerOpen: {
    left: '15%',
    [theme.breakpoints.down('xs')]: {
      left: '42%'
    }
  },
  iconButton: {
    position: 'absolute',
    top: 45,
    padding: 0,
    border: '1px solid white',
    zIndex: 1002
  },
  icon: {
    fontSize: 16,
  },
}))

export default useStyles