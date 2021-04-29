import React from 'react';
import Button from '@material-ui/core/Button';
import withRoot from 'withRoot';
import { CircularProgress, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 200,
    background: 'linear-gradient(115.22deg, #94DAF9 -9.12%, #1E88E5 90.34%)',
    padding: theme.spacing(3/4, 3),
    minWidth: props => props.compact ? undefined : 160,
    minHeight: 36
  }
}));

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
      {
        loading ?
          <CircularProgress color="secondary" size={20}/> :
          children
      }
    </Button>
  );
};

export default withRoot(GradientButton);
