import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  largeTitleContainer: {
    paddingTop: theme.spacing(2),
    overflow: 'hidden',
    display: 'grid',
    justifyContent: 'center'
  },
  largeTitle: {
    fontWeight: 700,
    fontSize: 28
  }
}));
