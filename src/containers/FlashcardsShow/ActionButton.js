import { Button, withStyles } from '@material-ui/core';

const ActionButton = withStyles((theme) => ({
  root: {
    backgroundColor: '#3F4146',
    borderRadius: theme.spacing(1),
    minWidth: 230,
    fontSize: 24,
    '&:hover': {
      backgroundColor: theme.circleIn.palette.hoverColor,
      '& svg': {
        color: theme.circleIn.palette.darkTextColor
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
