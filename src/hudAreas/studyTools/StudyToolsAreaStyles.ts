import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  container: {
    maxWidth: '1000px',
    height: '100%',
    overflow: 'auto',
    padding: theme.spacing(2)
  }
}));
