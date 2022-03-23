import { makeStyles } from '@material-ui/core/styles';

import { dialogStyle } from '../Dialog/Dialog';

const useStyles = makeStyles((theme: any) => ({
  dialog: {
    ...dialogStyle,
    width: 500,
    borderRadius: theme.spacing(),
    backgroundColor: theme.circleIn.palette.appBar
  },
  hrClass: {
    background: 'rgba(255, 255, 255, 0.3)'
  },
  removeUser: {
    backgroundColor: theme.circleIn.palette.removeColor,
    borderRadius: 20,
    padding: theme.spacing(0, 2),
    fontWeight: 700
  },
  searchStudent: {
    display: 'flex',
    alignItems: 'center',
    boxShadow: 'none',
    border: `1px solid ${theme.circleIn.palette.gray3}`
  },
  listRoot: {
    width: '100%',
    maxHeight: 400
  },
  input: {
    width: '100%'
  },
  okButtonClass: {
    backgroundColor: theme.circleIn.palette.removeColor,
    borderRadius: 20,
    color: 'white'
  },
  closeButtonClass: {
    color: 'white',
    backgroundColor: theme.circleIn.palette.appBar
  },
  removedUser: {
    backgroundColor: 'rgba(95, 97, 101, 0.75)',
    color: 'white',
    borderRadius: 20,
    padding: theme.spacing(0, 2),
    fontWeight: 700
  },
  undo: {
    marginRight: theme.spacing()
  },
  spacing: {
    marginRight: theme.spacing(0.5)
  }
}));
export default useStyles;
