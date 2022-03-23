import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import red from '@material-ui/core/colors/red';

export const styles = (theme) => ({
  red: {
    color: red[500]
  },
  blue: {
    color: blue[500]
  },
  green: {
    color: green[500]
  },
  grey: {
    color: grey[500]
  },
  margin: {
    padding: `0 ${theme.spacing()}px`
  }
});
