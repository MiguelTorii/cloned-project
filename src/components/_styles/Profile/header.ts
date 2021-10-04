import { gutterStyle } from "../Gutter";
export const styles = theme => ({
  container: {
    height: '100%',
    maxHeight: 'inherit',
    // display: 'flex',
    // flexDirection: ''
    padding: theme.spacing(0, 1)
  },
  root: { ...gutterStyle(theme),
    padding: theme.spacing(1, 0, 3, 0),
    backgroundColor: theme.circleIn.palette.feedBackground,
    flex: 1,
    position: 'relative'
  },
  coverContainer: {
    margin: theme.spacing(-1, -3, 0, -3),
    height: 115,
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(-1, -3, 0, -3)
    },
    [theme.breakpoints.only('sm')]: {
      margin: theme.spacing(-1, -3, 0, -3),
      height: 90
    },
    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(-1, -2, 0, -2),
      height: 70
    }
  },
  actionContainer: {
    position: 'absolute',
    right: 10,
    top: 10
  },
  cover: {
    width: '100%',
    minHeight: '100%'
  },
  helpButton: {
    margin: theme.spacing(2),
    width: 20,
    height: 20,
    borderRadius: '100%',
    position: 'absolute',
    top: 0,
    right: 0
  },
  name: {
    marginBottom: 0,
    marginRight: theme.spacing()
  },
  helpIcon: {
    width: 20,
    height: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: theme.circleIn.palette.primaryText1,
    backgroundColor: 'transparent',
    color: theme.circleIn.palette.primaryText1
  },
  logoIcon: {
    width: 15,
    height: 15,
    marginRight: theme.spacing(1),
    verticalAlign: 'middle'
  },
  penIcon: {
    backgroundColor: 'rgba(36, 37, 38, 0.6)',
    width: 32,
    height: 32,
    margin: theme.spacing(1)
  },
  gridInfo: {
    margin: theme.spacing(2, 0, 5, 20)
  },
  schoolGrid: {
    alignItems: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      alignItems: 'flex-start'
    }
  },
  avatarContainer: {
    position: 'absolute',
    left: theme.spacing(3),
    top: 53,
    [theme.breakpoints.down('sm')]: {
      top: 5
    }
  },
  avatar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 124,
    height: 124,
    position: 'relative'
  },
  progress: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 170,
    height: 170,
    borderRadius: '50%',
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.8)'
  },
  bigAvatar: {
    width: 90,
    height: 90,
    [theme.breakpoints.up('sm')]: {
      width: 124,
      height: 124
    },
    fontSize: theme.typography.h1.fontSize,
    margin: theme.spacing(2)
  },
  img: {
    textAlign: 'center'
  },
  button: {
    margin: theme.spacing(2)
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: theme.spacing(2)
  },
  statusLabel: {
    marginLeft: theme.spacing(1 / 2),
    marginRight: theme.spacing(2)
  },
  icon: {
    width: 20,
    height: 20,
    margin: theme.spacing(0, 1),
    verticalAlign: 'middle'
  },
  uploadButton: {
    background: 'linear-gradient(180deg, #94DAF9 0%, #1E88E5 100%)',
    width: 32,
    height: 32,
    minWidth: 32,
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderRadius: '100%',
    [theme.breakpoints.down('sm')]: {
      right: 15,
      bottom: 15
    }
  },
  upload: {
    margin: theme.spacing(2)
  },
  input: {
    display: 'none'
  },
  tabs: {
    marginTop: theme.spacing(6),
    borderRadius: '10px 10px 0 0',
    backgroundColor: theme.circleIn.palette.feedBackground,
    borderBottom: `solid 1px ${theme.circleIn.palette.modalBackground}`,
    '& .MuiTab-wrapper': {
      textTransform: 'none',
      fontSize: 20,
      color: theme.circleIn.palette.primaryText1,
      opacity: 0.6
    },
    '& .Mui-selected': {
      borderBottom: `4px solid ${theme.circleIn.palette.darkActionBlue}`,
      '& .MuiTab-wrapper': {
        opacity: 1
      }
    }
  },
  buttonText: {
    marginLeft: theme.spacing()
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  contentIcon: {
    marginRight: theme.spacing(),
    marginBottom: theme.spacing(2),
    height: 40
  }
});