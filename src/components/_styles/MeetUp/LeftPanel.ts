export const styles = theme => ({
  root: {
    display: 'none',
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 810,
    height: '100%'
  },
  paper: {
    position: 'relative',
    width: '100%',
    minWidth: 100,
    maxWidth: 100,
    backgroundColor: 'white',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    transition: 'margin-left 0.5s',
    display: 'flex',
    flexDirection: ' column'
  },
  paperHide: {
    marginLeft: -120
  },
  iconButton: {
    width: 100,
    height: 60
  },
  icon: {
    color: 'black'
  },
  drawer: {
    width: 400,
    backgroundColor: 'white',
    overflowY: 'hidden'
  },
  nav: {
    backgroundColor: 'white'
  },
  navButton: {
    color: 'black'
  },
  section: {
    // position: 'fixed',
    overflowY: 'auto',
    height: '100%'
  },
  hide: {
    display: 'none'
  },
  margin: {
    margin: theme.spacing(2)
  },
  scroll: {
    maxHeight: '80vh',
    overflow: 'scroll'
  },
  iconActive: {
    color: theme.circleIn.palette.brand
  }
});