import { Button, withStyles } from '@material-ui/core';

const ActionButton = withStyles((theme) => ({
  root: {
    backgroundColor: '#3F4146',
    borderRadius: theme.spacing(1),
    minWidth: 230,
    fontSize: 24,
    '&:hover': {
      background: 'linear-gradient(115.22deg, #94DAF9 -9.12%, #1E88E5 90.34%)',
      '& svg': {
        color: 'white'
      }
    }
  },
  startIcon: {
    marginRight: theme.spacing(2),
    '& > svg': {
      width: 28,
      height: 28,
      color: theme.circleIn.palette.darkTextColor
    }
  }
}))(Button);

export default ActionButton;
