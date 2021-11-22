import { Typography, withStyles } from '@material-ui/core';

export default withStyles((theme) => ({
  root: {
    fontSize: 36,
    fontWeight: 700,
    lineHeight: 1.3,
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      fontSize: 28
    }
  }
}))(Typography);
