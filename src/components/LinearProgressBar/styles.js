import makeStyles from '@material-ui/core/styles/makeStyles';

export default makeStyles((theme) => ({
  container: {
    width: 210,
    position: 'relative'
  },
  text: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: 14,
    fontWeight: 600
  }
}));
