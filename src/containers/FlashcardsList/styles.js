import makeStyles from '@material-ui/core/styles/makeStyles';

export default makeStyles((theme) => ({
  container: {
    padding: theme.spacing(5, 4),
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(3, 2)
    }
  },
  feedback: {
    cursor: 'pointer'
  }
}));
