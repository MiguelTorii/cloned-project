import { dialogStyle } from './Dialog';
import { gutterStyle } from './Gutter';
export const styles = (theme) => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    ...gutterStyle(theme),
    paddingTop: 0,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 654,
    height: 612,
    minWidth: 240
  },
  videoWrapper: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  mediaDevices: {
    width: '100%',
    position: 'absolute',
    top: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    color: 'white',
    zIndex: 1200
  },
  mediaControls: {
    position: 'absolute',
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1200
  },
  initials: {
    fontWeight: 700,
    fontSize: 150,
    color: '#000000'
  },
  profile: {
    width: '100%',
    height: '100%',
    backgroundColor: '#C4C4C4',
    borderRadius: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    zIndex: 1100
  },
  control: {
    position: 'relative',
    minWidth: 130,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    minHeight: 70,
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 40
    }
  },
  controlLabel: {
    position: 'absolute',
    left: 0,
    color: theme.circleIn.palette.secondaryText,
    fontSize: 16,
    fontWeight: 700,
    bottom: -2,
    minWidth: 130,
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  video: {
    width: '100% !important',
    objectFit: 'cover',
    borderRadius: 20,
    height: '248px  !important',
    transform: 'rotateY(180deg)',
    '-webkit-transform': 'rotateY(180deg)',

    /* Safari and Chrome */
    '-moz-transform': 'rotateY(180deg)'
    /* Firefox */
  },
  letsGo: {
    margin: theme.spacing(4, 0),
    minWidth: 340,
    borderRadius: 20,
    color: theme.circleIn.palette.white,
    fontWeight: 700,
    fontSize: 20,
    background: 'linear-gradient(114.44deg, #94DAF9 9.9%, #1E88E5 83.33%)'
  },
  ready: {
    textAlign: 'center',
    borderBottom: '1px solid #FFFFFF',
    padding: theme.spacing(),
    fontSize: 24,
    fontWeight: 400,
    margin: theme.spacing(2, 0),
    width: '100%'
  },
  margin: {
    marginTop: theme.spacing(2)
  },
  tada: {
    marginLeft: theme.spacing()
  },
  dialog: { ...dialogStyle, width: 600 },
  rules: {
    fontSize: 16,
    fontWeight: 400
  },
  box: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(0, 2, 1, 2),
    letterSpacing: 0.25,
    width: '100%',
    border: '1px solid #FFFFFF',
    borderRadius: 20,
    [theme.breakpoints.down('sm')]: {
      paddingBottom: 0
    }
  },
  icon: {
    fontSize: 50
  },
  avatarImage: {
    objectFit: 'fill'
  }
});
