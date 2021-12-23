import { withStyles, Button } from '@material-ui/core';

export default withStyles((theme) => ({
  root: {
    backgroundColor: 'white',
    color: theme.circleIn.palette.modalBackground,
    fontSize: 18,
    fontWeight: 'bold',
    borderRadius: 10,
    minWidth: 135,
    boxShadow: '6px 6px 40px rgba(0, 0, 0, 0.2)',
    '&:hover': {
      backgroundColor: theme.circleIn.palette.brand,
      color: 'white'
    },
    '&.Mui-disabled': {
      backgroundColor: 'white'
    },
    [theme.breakpoints.down('sm')]: {
      backgroundColor: theme.circleIn.palette.brand,
      color: 'white'
    }
  }
}))(Button);
