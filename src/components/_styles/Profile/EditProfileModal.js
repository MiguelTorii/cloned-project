import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  root: {
    width: 610,
    maxWidth: '100%',
    marginLeft: 0
  },
  penButton: {
    background: 'linear-gradient(180deg, #94DAF9 0%, #1E88E5 100%)',
    width: 32,
    height: 32,
    minWidth: 32,
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderRadius: '100%'
  }
}));
