import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  refereeItem: {
    padding: theme.spacing(3 / 2),
    backgroundColor: theme.circleIn.palette.gray2,
    margin: theme.spacing(2, 0)
  }
}));
