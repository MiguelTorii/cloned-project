import makeStyles from '@material-ui/core/styles/makeStyles';

export default makeStyles((theme) => ({
  sidebar: {
    backgroundColor: '#1E1F22',
    padding: theme.spacing(5, 4),
    minHeight: '100vh',
    width: 330,
    position: 'fixed',
    userSelect: 'none'
  },
  mainContent: {
    padding: theme.spacing(6, 4, 3, 4),
    backgroundColor: '#28292C',
    flexGrow: 1,
    width: '100%',
    height: '100vh',
    userSelect: 'none',
    '&.expanded': {
      marginLeft: 330,
      width: 'calc(100% - 330px)'
    }
  },
  contentBox: {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden'
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
    top: 30,
    right: theme.spacing(-5),
    transform: 'translateX(-50%)'
  },
  bodyButton: {
    top: 30,
    left: 0
  },
  hidden: {
    display: 'none'
  },
  iconMiddle: {
    verticalAlign: 'middle'
  },
  actionButton: {
    backgroundColor: '#1E1F22',
    height: 32,
    borderRadius: 40,
    marginLeft: theme.spacing(1),
  },
  actionBar: {
    position: 'absolute',
    top: 10,
    right: 10
  },
  btnClose: {
    position: 'absolute',
    top: 10,
    right: 10
  },
  sidebarCard: {
    backgroundColor: theme.circleIn.palette.modalBackground,
    padding: theme.spacing(2),
    borderRadius: 10
  },
  cardTitle: {
    textTransform: 'uppercase',
    marginBottom: theme.spacing(1)
  },
  textSuccess: {
    color: '#74C182'
  },
  textDanger: {
    color: '#C45960'
  },
  cardSubText: {
    display: 'inline',
    marginLeft: theme.spacing(1)
  },
  contentCard: {
    position: 'absolute',
    backgroundColor: theme.circleIn.palette.modalBackground,
    maxWidth: 350,
    padding: theme.spacing(5/2),
    borderRadius: 8,
    border: 'solid 2px #1E1F22',
    boxShadow: '6px 7px 30px rgba(30, 31, 34, 0.3)',
    cursor: 'move',
    '&:hover, &.hover': {
      border: 'solid 2px #999'
    },
    '&.dragging': {
      display: 'none'
    },
    '&.correct': {
      border: 'solid 4px #74C182'
    },
    '&.incorrect': {
      border: 'solid 4px #C45960'
    }
  },
  contentText: {
    maxHeight: 250,
    overflowY: 'auto'
  },
  imageContainer: {
    width: 96,
    minWidth: 96,
    height: 72,
    margin: theme.spacing(0, 1)
  },
  contentImage: {
    maxWidth: '100%',
    maxHeight: '100%'
  },
  startupModal: {
    backgroundColor: '#3A3B3B'
  },
  modalGif: {
    width: 180
  },
  congratsGif: {
    width: 300
  },
  highScoreText: {
    color: theme.circleIn.palette.primaryii222
  },
  scoreImage: {
    verticalAlign: 'middle',
    marginLeft: theme.spacing(1)
  }
}));
