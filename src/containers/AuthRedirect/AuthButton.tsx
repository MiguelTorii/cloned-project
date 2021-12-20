import { withStyles, Button } from '@material-ui/core';

export default withStyles((theme) => ({
  root: {
    backgroundColor: 'white',
    color: theme.circleIn.palette.modalBackground,
    fontSize: 18,
    borderRadius: 10,
    '&:hover': {
      backgroundColor: theme.circleIn.palette.brand
    },
    '&.Mui-disabled': {
      backgroundColor: 'white'
    }
  }
}))(Button);
