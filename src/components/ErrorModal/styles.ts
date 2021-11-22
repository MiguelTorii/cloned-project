import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  modal: {
    width: 600,
    backgroundColor: theme.circleIn.palette.errorPopupBackground,
    color: theme.circleIn.palette.black
  },
  container: {
    height: 250
  },
  errorTitle: {
    fontSize: 220,
    fontWeight: 600,
    color: theme.circleIn.palette.errorPopupTitle
  },
  errorText: {
    fontSize: 18
  },
  title: {
    color: 'black'
  },
  closeIcon: {
    color: 'black'
  },
  hr: {
    border: 'solid 1px black'
  },
  image: {
    width: 180,
    display: 'flex',
    justifyContent: 'center'
  }
}));
