import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
  },
  header: {
    zIndex: 1000,
    left: 0,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    margin: theme.spacing(1.5, 3, 0, 3)
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  search: {
    backgroundColor: 'rgba(34, 34, 34, 0.6)',
    border: '1px solid rgba(95, 97, 101, 0.5)',
    color: 'white',
    fontSize: 12,
    borderRadius: theme.spacing(1),
    display: 'flex',
    justifyContent: 'flex-start',
    padding: theme.spacing(1),
    margin: theme.spacing(0, 2)
  },
  inputRoot: {
    color: 'inherit',
  },
  placeholderInput: {
    color: 'white',
    fontSize: 12,
    padding: 0
  },
  headerTitle: {
    margin: theme.spacing(1, 1, 0, 1),
    width: `calc(100% - ${theme.spacing(2)}px)`,
  },
  createNewChate: {
    fontWeight: 'bold'
  },
  gridItem: {
    width: `calc(100% - ${theme.spacing(2)}px)`,
    margin: theme.spacing(2, 1),
  },
  gridChatList: {
    width: 'inherit',
    marginBottom: theme.spacing(6)
  },
  imgIcon: {
  },
  newButton: {
    padding: 0,
    minWidth: 0,
    width: 20,
    height: 20,
    fontSize: '1rem',
    background: 'linear-gradient(115.22deg, #94DAF9 -9.12%, #1E88E5 90.34%)',
    textTransform: 'none',
    fontWeight: 'bold',
    color: 'black',
    marginLeft: theme.spacing(1),
    borderRadius: theme.spacing(0.5)
  },
  title: {
    fontSize: 22
  },
  hidden: {
    display: 'none'
  },
  selectClassmates: {
    backgroundColor: theme.circleIn.palette.appBar,
    marginTop: theme.spacing()
  }
}))

export default useStyles