import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.circleIn.palette.formBackground,
    padding: theme.spacing(2, 0)
  },
  menu: {
    overflow: 'auto'
  }
}));

export default useStyles;
