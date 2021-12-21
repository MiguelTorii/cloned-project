import { makeStyles } from '@material-ui/core/styles';
import { dialogStyle } from '../../components/Dialog/Dialog';

export const useStyles = makeStyles((theme: any) => ({
  modalOverlay: {
    display: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.circleIn.palette.primaryBackground,
    zIndex: 1000
  },
  content: {
    alignItems: 'center',
    display: 'flex',
    flex: 'initial',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 'initial'
  },
  welcomeMessageContainer: {
    margin: theme.spacing(1)
  },
  welcomeButtonsContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1 / 2),
    margin: theme.spacing(1)
  },
  button: {
    borderRadius: 8,
    borderWidth: 2,
    fontWeight: 'bold',
    margin: '0px 10px',
    padding: '4px 30px'
  },
  buttonLarge: {
    padding: '8px 48px'
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    margin: '20px 0px'
  },
  subtitle: {
    fontSize: 16,
    maxWidth: 600,
    textAlign: 'center'
  },
  dialog: { ...dialogStyle, padding: 20, width: 750 }
}));
