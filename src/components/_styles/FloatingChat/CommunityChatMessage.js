import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1, 6),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 0,
      paddingRight: 0
    }
  },
  report: {
    color: theme.circleIn.palette.danger
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing(),
    marginBottom: theme.spacing(),
    alignItems: 'flex-start'
  },
  justifyEnd: {
    justifyContent: 'flex-end'
  },
  name: {
    color: 'white',
    paddingLeft: 0,
  },
  message: {
    maxWidth: '100%',
    width: '100%',
    margin: theme.spacing(0.5),
    display: 'flex',
    flexDirection: 'column'
  },
  messageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  threeDots: {
    backgroundColor: theme.circleIn.palette.menuBackground,
    minWidth: 20,
    padding: 0
  },
  userMenu: {
    backgroundColor: theme.circleIn.palette.feedBackground
  },
  bodyWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    borderRadius: 5,
    marginBottom: theme.spacing(),
    maxWidth: 120,
    '&:hover': {
      cursor: 'pointer'
    }
  },
  createdAt: {
    paddingLeft: theme.spacing(2),
    color: theme.circleIn.palette.primaryText1
  },
  videoSpace: {
    height: 70,
    width: '100%'
  },
  video: {
    flex: 1,
    position: 'absolute',
    maxWidth: 250,
    width: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  videoTitle: {
    color: 'white'
  },
  videoSubTitle: {
    textAlign: 'center',
    color: 'white'
  },
  body: {
    flex: 1,
    textAlign: 'left',
    color: 'white',
    wordWrap: 'break-word',
    width: '100%',
    maxWidth: 900,
    overflowY: 'visible',
    maxHeight: '100%',
    padding: 0,
    '& > p': {
      margin: 0
    }
  },
  avatarLink: {
    textDecoration: 'none',
    minWidth: 45,
    marginTop: 3
  },
  link: {
    color: 'white',
    fontSize: '1rem',
    fontWeight: 700
  },
  videoAlertRoot: {
    minWidth: 275,
    backgroundColor: theme.circleIn.palette.appBar,
    borderRadius: 20
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    color: 'white',
    fontSize: 14,
  },
  cardContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(0, 2, 2, 2)
  },
  join: {
    background: 'linear-gradient(180deg, #94DAF9 0%, #1E88E5 100%)',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: 10
  },
  camera: {
    marginRight: theme.spacing(1)
  },
  alertWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  alert: {
    color: theme.circleIn.palette.darkTextColor,
    backgroundColor: theme.circleIn.palette.modalBackground,
    padding: theme.spacing(1, 3),
    borderRadius: 20
  }
}));

export default useStyles