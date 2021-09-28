import makeStyles from '@material-ui/core/styles/makeStyles';

export default makeStyles((theme: any) => ({
  root: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
  image: {
    maxWidth: '100%',
    '&.disabled': {
      opacity: 0.2
    }
  }
}));
