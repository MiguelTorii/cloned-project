import makeStyles from '@material-ui/core/styles/makeStyles';
export default makeStyles((theme) => ({
  sidebar: {
    backgroundColor: '#1E1F22',
    padding: theme.spacing(10, 4),
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
    marginLeft: 30,
    '&.expanded': {
      marginLeft: 330,
      width: 'calc(100% - 330px)'
    }
  },
  contentBox: {
    borderRadius: 10,
    width: '100%',
    backgroundColor: '#303135',
    paddingBottom: theme.spacing(6)
  },
  sectionTitle: {
    padding: theme.spacing(2, 3),
    backgroundColor: '#37393E'
  },
  firstSection: {
    borderRadius: '10px 10px 0 0'
  },
  matchContainer: {
    padding: theme.spacing(3, 2, 5, 2)
  },
  choiceContainer: {
    padding: theme.spacing(3, 3, 5, 3)
  },
  checkIconContainer: {
    minWidth: 25
  },
  matchQuestionText: {
    marginLeft: theme.spacing(3)
  },
  matchQuestionSelect: {
    borderRadius: 0,
    height: 24,
    maxWidth: 60,
    minWidth: 60,
    textAlign: 'center',
    '&:before': {
      borderColor: '#5F6165'
    }
  },
  correctBackground: {
    background: 'rgba(116, 193, 130, 0.25)'
  },
  checkImage: {
    verticalAlign: 'middle'
  },
  wrongBackground: {
    background: 'rgba(196, 89, 96, 0.3)'
  },
  textWhite: {
    color: 'white !important'
  },
  choiceRadio: {
    marginLeft: 0
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
  iconImage: {
    cursor: 'pointer',
    verticalAlign: 'middle',
    maxWidth: 80,
    maxHeight: 60,
    borderRadius: 8,
    marginRight: theme.spacing(1)
  },
  actionButton: {
    backgroundColor: '#1E1F22',
    height: 32,
    borderRadius: 40,
    marginLeft: theme.spacing(1)
  }
}));
