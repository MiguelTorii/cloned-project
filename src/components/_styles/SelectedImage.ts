import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  imgContainer: {
    position: 'absolute',
    zIndex: 1,
    display: 'flex',
    top: theme.spacing(),
    left: theme.spacing(),
    borderRadius: theme.spacing(),
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonGroup: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.8)'
    },
    minWidth: 0
  },
  hidden: {
    display: 'none'
  }
}));
