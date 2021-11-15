import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  container: {
    width: '100%',
    height: '100%',
    overflow: 'auto'
  },
  calendarContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(1)
  }
}));
