import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: any) => ({
  collapseIcon: {
    padding: 3,
    marginRight: 3
  },
  collapseIconLeft: {
    marginLeft: 3,
    padding: 3,
    transform: 'rotate(180deg)'
  }
}));

export default useStyles;
