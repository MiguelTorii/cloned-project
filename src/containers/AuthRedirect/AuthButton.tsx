import { withStyles, Button } from '@material-ui/core';

export default withStyles((theme) => ({
  root: {
    backgroundColor: 'white',
    color: theme.circleIn.palette.modalBackground,
    fontSize: 18,
    fontWeight: 700,
    borderRadius: 10,
    '&.Mui-disabled': {
      backgroundColor: 'white'
    }
  }
}))(Button);
