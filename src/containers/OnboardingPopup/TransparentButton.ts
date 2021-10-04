import { Button, withStyles } from "@material-ui/core";
import withRoot from "../../withRoot";
const ActionButton = withStyles(theme => ({
  root: {
    borderRadius: 200,
    padding: theme.spacing(3 / 4, 1),
    background: 'transparent',
    width: 120,
    minHeight: 36,
    '&:disabled': {
      color: 'white'
    }
  },
  label: {
    fontSize: 16,
    fontWeight: 700,
    color: 'white'
  }
}))(Button);
export default withRoot(ActionButton);