import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  container: {
    position: 'relative',
    height: 'inherit',
  },
  left: {
    position: 'relative',
    overflow: 'auto',
    height: '100%',
    boxSizing: 'border-box',
    backgroundColor: theme.circleIn.palette.navbarBackgroundColor,
    border: `1px solid ${theme.circleIn.palette.navbarBorderColor}`,
  },
  main: {
    display: 'flex',
    position: 'relative',
    borderLeft: '1px solid rgba(255,255,255,0.15)',
    borderRight: '1px solid rgba(255,255,255,0.15)',
    height: '100%',
  },
  right: {
    height: '100%',
    overflow: 'auto',
  },
  hidden: {
    border: 'none',
    display: 'none'
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
  leftDrawerClose: {
    left: 0,
  },
  leftDrawerOpen: {
    left: '16%',
    [theme.breakpoints.down('md')]: {
      left: '31%'
    },
    [theme.breakpoints.down('xs')]: {
      left: '92%'
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