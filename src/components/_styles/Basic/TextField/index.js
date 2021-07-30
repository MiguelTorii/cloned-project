import { TextField as MuiTextField, withStyles } from '@material-ui/core';

export const StyledTextField = withStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white'
      }
    },
    '& label': {
      fontSize: 24
    },
    '& legend': {
      fontSize: 18
    }
  }
})(MuiTextField);
