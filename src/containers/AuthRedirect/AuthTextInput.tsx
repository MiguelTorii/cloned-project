import { Input, withStyles } from '@material-ui/core';

export default withStyles((theme) => ({
  root: {
    borderRadius: 10,
    fontSize: 20,
    padding: theme.spacing(0.5, 2),
    border: 'solid 1px rgba(0, 0, 0, 0.5)',
    background: 'white',
    color: theme.circleIn.palette.primaryBackground,
    '& input::placeholder': {
      color: theme.circleIn.palette.backup
    },
    '&:after, &:before': {
      borderBottom: 'none !important'
    }
  }
}))(Input);
