import makeStyles from '@material-ui/core/styles/makeStyles';
export default makeStyles((theme) => ({
  root: {
    padding: theme.spacing(5, 4),
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(3, 2)
    }
  }
}));
