import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  container: {
    width: '100%',
    height: '100%',
    overflow: 'auto',
    padding: theme.spacing(2)
  },
  item: {
    display: 'flex'
  }
}));
