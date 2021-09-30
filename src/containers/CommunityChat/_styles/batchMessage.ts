import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  selectClasses: {
    width: '100%',
    padding: theme.spacing(),
    float: 'right',
    '& button': {
      width: '100%',
      fontWeight: 'bold',
      color: 'white',
      background: 'linear-gradient(115.22deg, #94DAF9 -9.12%, #1E88E5 90.34%)',
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
      borderRadius: 20
    }
  }
}));
export default useStyles;
