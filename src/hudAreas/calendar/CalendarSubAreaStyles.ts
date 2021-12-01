import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  container: {
    flexGrow: 0,
    height: '100%',
    overflow: 'auto',
    padding: theme.spacing(2)
  }
}));
