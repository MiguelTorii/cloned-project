import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3)
  },
  mainContainer: {
    justifyContent: 'flex-start',
    [theme.breakpoints.up('md')]: {
      justifyContent: 'space-between'
    }
  },
  textAlign: {
    textAlign: 'right',
    [theme.breakpoints.down('sm')]: {
      textAlign: 'left'
    }
  },
  subtext: {
    fontWeight: 700,
    [theme.breakpoints.up('md')]: {
      color: '#5F6165'
    }
  }
}));
