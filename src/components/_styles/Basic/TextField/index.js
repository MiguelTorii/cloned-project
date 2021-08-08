import { TextField as MuiTextField, withStyles } from '@material-ui/core';

export const StyledTextField = withStyles((theme) => ({
  root: {
    '& .MuiOutlinedInput-root': {
      // '& fieldset': {
      //   borderColor: 'white'
      // },
      '&.Mui-focused fieldset': {
        borderColor: theme.circleIn.palette.action
      }
    },
    '& label': {
      fontSize: 24
    },
    '& legend': {
      fontSize: 18
    }
  }
}))(MuiTextField)
