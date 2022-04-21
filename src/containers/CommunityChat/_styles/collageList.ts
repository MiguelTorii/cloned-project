import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: any) => ({
  divider: {
    backgroundColor: theme.circleIn.palette.menuDivider,
    marginBottom: theme.spacing(2)
  }
}));
export default useStyles;
