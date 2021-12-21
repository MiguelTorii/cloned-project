import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    cursor: 'pointer'
  },
  textContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: 'white',
    fontSize: 14
  }
}));
