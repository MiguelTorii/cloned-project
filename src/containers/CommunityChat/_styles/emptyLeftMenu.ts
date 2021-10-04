import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles(theme => ({
  container: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  inviteButton: {
    zIndex: 1000,
    position: 'fixed',
    fontWeight: 'bold',
    backgroundColor: '#539f56',
    width: '23%',
    bottom: 10,
    [theme.breakpoints.down('xs')]: {
      width: '40%',
      bottom: 68
    }
  },
  newButton: {
    padding: 0,
    minWidth: 0,
    width: 20,
    height: 20,
    backgroundColor: `${theme.circleIn.palette.backup} !important`,
    textTransform: 'none',
    fontWeight: 'bold',
    color: 'white !important',
    borderRadius: 0
  },
  messageContainer: {
    position: 'absolute',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    top: 160
  },
  message: {
    fontSize: 14,
    marginTop: theme.spacing(),
    textAlign: 'center'
  },
  createDM: {
    marginTop: theme.spacing(3),
    width: '100%',
    fontWeight: 'bold',
    color: 'white',
    background: 'linear-gradient(115.22deg, #94DAF9 -9.12%, #1E88E5 90.34%)',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
    borderRadius: 20
  },
  loading: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    textAlign: 'center'
  },
  loadingChannels: {
    color: 'white'
  }
}));
export default useStyles;