import { makeStyles } from '@material-ui/core/styles';
import { dialogStyle } from 'components/Dialog/Dialog';

const useStyles = makeStyles((theme) => ({
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
    background: 'linear-gradient(115.22deg, #94DAF9 -9.12%, #1E88E5 90.34%)',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
    borderRadius: 20,
    color: 'white'
  },
  cancleButtonClass: {
    border: '1px solid white',
    borderRadius: 20,
    color: 'white'
  },
  alertTitle: {
    marginBottom: theme.spacing()
  },
  headerTitleClass: {
    fontSize: 18
  },
  hrClass: {
    background: 'rgba(255, 255, 255, 0.3)'
  }
}));

export default useStyles;
