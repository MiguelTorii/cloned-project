import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  container: {
    height: '100%',
    overflow: 'auto',
    padding: theme.spacing(2)
  },
  workflowContainer: {
    flexGrow: 0,
    height: '100%',
    overflow: 'auto',
    padding: theme.spacing(2)
  }
}));
