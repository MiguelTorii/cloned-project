import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
  header: {
    fontWeight: 'bold',
    fontSize: 20
  },
  list: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    padding: 0
  }
}));
