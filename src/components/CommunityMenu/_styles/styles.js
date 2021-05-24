import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  listItem: {
    width: 40,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  itemContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 50,
    padding: theme.spacing()
  },
  selectedItem: {
    border: `3px solid ${theme.circleIn.palette.white}`
  },
  unreadMessageCount: {
    top: '95%',
    right: 5,
    padding: theme.spacing(0, 0.5),
    minWidth: 25
  },
  emptyUnreadMessage: {
    backgroundColor: 'white',
    right: 5,
    top: '90%'
  }
}))

export default useStyles