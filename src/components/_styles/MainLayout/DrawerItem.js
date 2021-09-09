import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  root: {
    flexShrink: 0
  },
  menuIcon: {
    marginRight: theme.spacing(),
    minHeight: 28,
    minWidth: 28,
    justifyContent: 'center',
    alignItems: 'center'
  }
}));
