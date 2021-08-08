import React from 'react';
import Button from '@material-ui/core/Button';
import { CircularProgress } from '@material-ui/core';
import { useStyles } from '../../_styles/Basic/Buttons/GradientButton';

type Props = {
  children: React.ElementType,
  compact: boolean,
  loading: boolean,
  [key: string]: any
};

const GradientButton = ({ children, compact, loading, ...rest }: Props) => {
  const classes = useStyles({ compact });

  return (
    <Button
      classes={{
        root: classes.root
      }}
      {...rest}
    >
      {loading ? <CircularProgress color="secondary" size={20} /> : children}
    </Button>
  );
};

export default GradientButton;
