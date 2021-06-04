import makeStyles from '@material-ui/core/styles/makeStyles';

export default makeStyles((theme) => ({
  sidebar: {
    backgroundColor: '#1E1F22',
    padding: theme.spacing(10, 5),
    minHeight: '100vh',
    width: 330,
    position: 'fixed'
  },
  unExpandedSidebar: {
    transform: 'translateX(-300px) !important',
    visibility: 'visible !important'
  },
  mainContent: {
    padding: theme.spacing(5, 6),
    backgroundColor: '#28292C',
    flexGrow: 1,
    width: '100%',
    minHeight: '100vh',
    userSelect: 'none',
    marginLeft: 30,
    '&.expanded': {
      marginLeft: 330,
      width: 'calc(100% - 330px)'
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
    top: 30,
    right: theme.spacing(-5),
    transform: 'translateX(-50%)'
  },
  bodyButton: {
    top: 30,
    left: 0
  },
  markCardContainer: {
    backgroundColor: theme.circleIn.palette.modalBackground,
    padding: theme.spacing(2),
    borderRadius: 10,
    cursor: 'pointer',
    border: 'solid 2px transparent',
    '&.active': {
      borderColor: (props) => props.markColor || 'primary',
    },
    userSelect: 'none'
  },
  markTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  markText: {
    fontSize: 34,
    color: (props) => props.markColor || 'primary'
  },
  actionButton: {
    backgroundColor: '#1E1F22',
    height: 32,
    borderRadius: 40,
    marginLeft: theme.spacing(1),
  },
  shuffleButton: {
    color: '#5F6165',
    fontSize: 20,
    fontWeight: 'bold',
    '& svg': {
      color: '#5F6165',
      width: 25,
      height: 25
    },
    '&.active': {
      color: 'white'
    },
    '&.active svg': {
      color: 'white'
    }
  },
  gradientBar: {
    height: 8,
    borderRadius: '10px 10px 0 0',
    margin: theme.spacing(-1, -3, 0, -3),
    background: 'linear-gradient(115.22deg, #94DAF9 -9.12%, #1E88E5 90.34%)'
  },
  cardBoardContainer: {
    width: '100%',
    height: 600,
    backgroundColor: theme.circleIn.palette.modalBackground,
    borderRadius: 10,
    padding: theme.spacing(1, 3, 3, 3),
    display: 'flex',
    flexDirection: 'column'
  },
  cardBoardContent: {
    flexGrow: 1,
    paddingTop: theme.spacing(3),
    height: '60%'
  },
  cardBoardTextContainer: {
    width: '100%',
    height: '100%',
    overflowY: 'auto',
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 24,
    '&.large-font': {
      fontSize: 34
    }
  },
  cardBoardImage: {
    maxWidth: '100%',
    maxHeight: '100%'
  },
  cardBoardActionButton: {
    backgroundColor: '#242526',
    padding: theme.spacing(1, 3),
    borderRadius: 50,
    fontSize: 18,
    fontWeight: 800
  },
  cardBoardFooter: {
    height: 80,
    paddingTop: theme.spacing(3),
    borderTop: '1px solid rgba(0, 0, 0, 0.2)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  flipButton: {
    fontSize: 34,
    fontWeight: 700,
    '& svg': {
      width: 27,
      height: 27
    }
  },
  hidden: {
    display: 'none'
  },
  iconMiddle: {
    verticalAlign: 'middle'
  },
  secondaryText: {
    color: theme.circleIn.palette.darkTextColor
  },
  successText: {
    color: theme.circleIn.palette.success
  }
}));
