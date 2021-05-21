import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  header: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    minHeight: 60,
    backgroundColor: theme.circleIn.palette.modalBackground,
    width: '100%',
    padding: theme.spacing(1, 3),
  },
  headerIcon: {
    marginRight: theme.spacing()
  },
  headerTitle: {
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontWeight: 700,
    textOverflow: 'ellipsis',
    padding: theme.spacing(0, 1),
  },
  chatIcons: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  chatIcon: {
    paddingTop: 0,
    paddingBottom: 0
  },
  removeStudent: {
    color: theme.circleIn.palette.danger
  }
}))

export default useStyles