import { dialogStyle } from '../Dialog';

export const styles = (theme) => ({
  dialog: { ...dialogStyle, width: 500, zIndex: 2100 },
  container: {
    position: 'relative'
  },
  hoverMenu: {
    position: 'absolute',
    bottom: 0,
    right: 10
  },
  root: {
    display: 'flex',
    padding: theme.spacing(),
    width: '100%'
  },
  dark: {
    backgroundColor: theme.circleIn.palette.primaryBackground
  },
  selected: {
    backgroundColor: theme.circleIn.palette.rowSelection
  },
  progress: {
    display: 'flex',
    padding: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  grow: {
    flex: 1,
    paddingLeft: theme.spacing(),
    minWidth: 0,
    textAlign: 'left'
  },
  lastMessage: {
    maxHeight: 20,
    '& > p': {
      margin: 0
    }
  },
  margin: {
    margin: theme.spacing(2)
  }
});
