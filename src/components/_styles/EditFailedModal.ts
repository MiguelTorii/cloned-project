import { makeStyles } from '@material-ui/core/styles';
import { dialogStyle } from '../Dialog/Dialog';

const useStyles = makeStyles((theme: any) => ({
  dialog: {
    ...dialogStyle,
    width: 500,
    zIndex: 2100,
    borderRadius: 10,
    backgroundColor: theme.circleIn.palette.appBar,
    '& > hr': {
      color: 'white'
    }
  },
  okButtonClass: {
    background: theme.circleIn.palette.sendMessageButton,
    borderRadius: 20,
    color: 'white'
  },
  alertTitle: {
    marginBottom: theme.spacing()
  },
  headerTitleClass: {
    fontSize: 24
  },
  hrClass: {
    background: 'rgba(255, 255, 255, 0.3)'
  }
}));
export default useStyles;
