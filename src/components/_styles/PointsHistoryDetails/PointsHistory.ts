import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  root: {
    padding: theme.spacing(3, 2)
  },
  scroller: {
    overflow: 'hidden !important'
  }
}));
