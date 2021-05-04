import { makeStyles } from '@material-ui/core/styles'
import { dialogStyle } from 'components/Dialog';

const useStyles = makeStyles(theme => ({
  dialog: {
    ...dialogStyle,
    width: 500,
    zIndex: 2100
  },
  container: {
    position: 'relative'
  },
  hoverMenu: {
    position: 'absolute',
    bottom: 0,
    right: 10,
  },
  root: {
    display: 'flex',
    padding: theme.spacing(1, 3),
    width: '100%'
  },
  dark: {
    backgroundColor: theme.circleIn.palette.primaryBackground,
  },
  selected: {
    backgroundColor: theme.circleIn.palette.rowSelection,
  },
  progress: {
    display: 'flex',
    padding: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  avatarProfile: {
    backgroundColor: theme.circleIn.palette.brand,
    color: 'white',
    border: '2px solid white'
  },
  grow: {
    flex: 1,
    paddingLeft: theme.spacing(),
    minWidth: 0,
    textAlign: 'left'
  },
  roomName: {
    fontWeight: 700
  },
  groupMemberCount: {
    fontSize: 12,
    fontWeight: 400
  },
  margin: {
    margin: theme.spacing(2)
  },
  leaveGroup: {
    color: theme.circleIn.palette.danger
  }
}))

export default useStyles