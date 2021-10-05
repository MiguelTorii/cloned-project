import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: any) => ({
  tooltip: {
    fontSize: 14
  },
  root: {
    display: 'flex',
    bottom: 0,
    margin: theme.spacing(0, 5),
    borderRadius: theme.spacing(2),
    backgroundColor: theme.circleIn.palette.searchInputColor,
    boxShadow: 'none'
  },
  inputContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    borderRadius: theme.spacing(4),
    backgroundColor: theme.circleIn.palette.searchInputColor,
    marginLeft: 8
  },
  form: {
    display: 'flex',
    flex: 1
  },
  textfield: {
    width: '100%',
    flex: 1
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
    padding: theme.spacing(1, 1.5)
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
    width: '60%',
    borderRadius: 4
  },
  clearIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  emoIconStyle: {
    color: theme.circleIn.palette.brand,
    margin: theme.spacing(0, 0.5)
  }
}));
export default useStyles;
