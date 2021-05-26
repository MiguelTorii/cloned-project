import makeStyles from '@material-ui/core/styles/makeStyles';

export default makeStyles((theme) => ({
  root: {
    position: 'fixed',
    borderRadius: '8px 0 0 8px !important',
    bottom: 100,
    width: 64,
    height: 64,
    '&.invisible': {
      display: 'none'
    }
  }
}));
