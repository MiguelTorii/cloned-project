import React from 'react';
import { TextField as MuiTextField, withStyles } from '@material-ui/core';

const StyledTextField = withStyles({
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

type Props = {
  [key: string]: any
};

const TextField = ({ variant, ...rest }: Props) => {
  return (
    <StyledTextField
      variant={variant || 'outlined'}
      {...rest}
    />
  );
};

export default TextField;
