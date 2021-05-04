import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
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
    fontSize: 20,
    marginTop: theme.spacing(),
    textAlign: 'center'
  },
  arrow: {
    width: 120,
    position: 'absolute',
    right: 0,
    top: -30
  },
  loading: {
    width: '100%',
    marginTop: theme.spacing(2),
    textAlign: 'center'
  }
}))

export default useStyles