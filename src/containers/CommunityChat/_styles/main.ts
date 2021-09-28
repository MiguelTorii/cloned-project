import { makeStyles } from '@material-ui/core/styles';
import CoverImg from 'assets/svg/community-chat-default-cover.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    height: 'inherit',
    width: '100%',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  messageRoot: {
    height: 'calc(100% - 120px)',
    flexGrow: 1,
    display: 'flex',
    margin: theme.spacing(3, 3, 0, 3),
    backgroundColor: theme.circleIn.palette.feedBackground,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    flexDirection: 'column',
    [theme.breakpoints.down('xs')]: {
      borderRadius: 0,
      margin: 0
    }
  },
  emptyChatImg: {
    width: 255
  },
  messageLoadingRoot: {
    height: 'calc(100% - 24px)',
    flexGrow: 1,
    display: 'flex',
    margin: theme.spacing(3, 3, 0, 3),
    backgroundColor: theme.circleIn.palette.feedBackground,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    flexDirection: 'column',
    [theme.breakpoints.down('xs')]: {
      borderRadius: 0,
      margin: 0
    }
  },
  messageLoadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: '100%',
    paddingBottom: theme.spacing(10)
  },
  expertTitle: {
    fontSize: 16,
    fontWeight: 400,
    textAlign: 'center'
  },
  messageScroll: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    minHeight: '100%'
  },
  messageContainer: {
    flex: 1,
    overflowY: 'auto',
    position: 'relative',
    marginBottom: 20,
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  },
  typing: {
    padding: theme.spacing(0, 2),
    minHeight: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  typingText: {
    fontSize: 12,
    marginLeft: theme.spacing()
  },
  videoLabel: {
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'none'
  },
  videoButton: {
    backgroundColor: theme.circleIn.palette.brand,
    fontWeight: 'bold',
    padding: theme.spacing(1 / 2, 1),
    color: theme.circleIn.palette.textOffwhite,
    borderRadius: theme.spacing(2)
  },
  videoIcon: {
    marginRight: theme.spacing(1 / 2),
    paddingBottom: theme.spacing(1 / 8)
  },
  selectClasses: {
    float: 'right'
  },
  unregisteredMessage: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: theme.spacing()
  },
  bannerImage: {
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundImage: `url(${CoverImg})`
  },
  banner: {
    width: '100%'
  }
}));

export default useStyles;
