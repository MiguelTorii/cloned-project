import makeStyles from '@material-ui/core/styles/makeStyles';

export default makeStyles((theme) => ({
  root: {
    border: '0 !important',
    '& > *': {
      margin: theme.spacing(0, 1),
      [theme.breakpoints.down('sm')]: {
        margin: theme.spacing(0, 1 / 3)
      }
    }
  }
}));
