import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
  },
  header: {
    zIndex: 1000,
    left: 0,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    margin: theme.spacing(5, 3, 0, 3)
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  search: {
    backgroundColor: theme.circleIn.palette.searchInputColor,
    color: 'white',
    fontSize: 12,
    boxSizing: 'border-box',
    boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)',
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
    backgroundColor: theme.circleIn.palette.backup,
    textTransform: 'none',
    fontWeight: 'bold',
    color: 'white',
    marginLeft: theme.spacing(1),
    borderRadius: 0
  },
  title: {
    fontSize: 22
  },
  hidden: {
    display: 'none'
  },
  selectClassmates: {
    backgroundColor: theme.circleIn.palette.modalBackground,
    marginTop: theme.spacing(),
    padding: theme.spacing(2)
  }
}))

export default useStyles