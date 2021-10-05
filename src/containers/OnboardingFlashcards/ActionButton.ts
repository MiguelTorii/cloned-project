import { Button, withStyles } from '@material-ui/core';
import withRoot from '../../withRoot';

const ActionButton = withStyles((theme) => ({
  root: {
    background: 'linear-gradient(114.44deg, #94DAF9 9.9%, #1E88E5 83.33%)',
    width: 163,
    height: 40,
    borderRadius: 20
  },
  label: {
    fontSize: 16,
    fontWeight: 700,
    color: 'white'
  }
}))(Button);
export default withRoot(ActionButton);