import makeStyles from '@material-ui/core/styles/makeStyles';

export default makeStyles((theme) => ({
  addDeckButton: {
    backgroundColor: 'rgba(55, 57, 62, 0.2)',
    border: '1px solid rgba(95, 97, 101, 0.5)',
    width: '100%',
    height: 160,
    textTransform: 'uppercase',
    fontSize: 20,
    fontWeight: 700,
    [theme.breakpoints.down('sm')]: {
      height: 80
    }
  }
}));
