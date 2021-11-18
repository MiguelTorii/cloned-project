import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  modal: {
    width: 600
  },
  container: {
    height: 250
  },
  errorText: {
    fontSize: 220,
    fontWeight: 600,
    color: theme.circleIn.palette.gray3
  },
  image: {
    width: 180,
    display: 'flex',
    justifyContent: 'center'
  }
}));
