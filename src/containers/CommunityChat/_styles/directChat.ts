import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: any) => ({
  container: {
    position: 'relative',
    height: 'inherit'
  },
  directContainer: {
    position: 'relative',
    height: 'inherit',
    borderLeft: '1px solid rgba(255,255,255,0.15)'
  },
  left: {
    position: 'relative',
    overflow: 'auto',
    height: '100%',
    boxSizing: 'border-box',
    backgroundColor: theme.circleIn.palette.navbarBackgroundColor,
    borderLeft: `1px solid ${theme.circleIn.palette.navbarBorderColor}`,
    borderRight: `1px solid ${theme.circleIn.palette.navbarBorderColor}`,
    borderBottom: `1px solid ${theme.circleIn.palette.navbarBorderColor}`
  },
  main: {
    display: 'flex',
    position: 'relative',
    height: '100%'
  },
  right: {
    height: '100%',
    overflow: 'auto',
    borderLeft: `1px solid ${theme.circleIn.palette.navbarBorderColor}`,
    borderRight: `1px solid ${theme.circleIn.palette.navbarBorderColor}`,
    borderBottom: `1px solid ${theme.circleIn.palette.navbarBorderColor}`
  },
  hidden: {
    border: 'none',
    display: 'none'
  },
  rightDrawerClose: {
    right: 0
  },
  rightDrawerOpen: {
    right: '24%',
    [theme.breakpoints.down('xs')]: {
      right: '48%'
    }
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
    left: '24.8%',
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
  },
  collapseIconLeft: {
    marginLeft: 3,
    padding: 3,
    transform: 'rotate(180deg)'
  }
}));
export default useStyles;
