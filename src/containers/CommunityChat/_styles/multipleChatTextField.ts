import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: any) => ({
  tooltip: {
    fontSize: 14
  },
  root: {
    display: 'flex',
    bottom: 0,
    width: '100%',
    backgroundColor: theme.circleIn.palette.modalBackground,
    padding: theme.spacing()
  },
  inputContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    borderRadius: theme.spacing(4),
    // backgroundColor: theme.circleIn.palette.primaryBackground,
    marginLeft: 8
  },
  form: {
    display: 'flex',
    flex: 1
  },
  textfield: {
    width: '100%' // paddingLeft: theme.spacing(2),
  },
  sendIcon: {
    color: theme.circleIn.palette.brand
  },
  imgIcon: {
    padding: 0
  },
  iconButton: {
    display: 'flex',
    alignItems: 'center',
    padding: 10
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4
  },
  input: {
    display: 'none'
  },
  imgContainer: {
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  img: {
    objectFit: 'scale-down',
    width: 60,
    borderRadius: 4
  },
  clearIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  formContainer: {
    flex: 1,
    padding: theme.spacing(1, 1 / 2, 0, 1 / 2),
    borderRadius: theme.spacing(),
    border: 'solid 1px rgba(255, 255, 255, 0.2)'
  }
}));
export default useStyles;
