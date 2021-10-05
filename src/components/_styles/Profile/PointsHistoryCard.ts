import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  root: {
    padding: theme.spacing(2, 3 / 2),
    backgroundColor: theme.circleIn.palette.gray1
  }
}));
