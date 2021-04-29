import React from 'react';
import Button from '@material-ui/core/Button';
import withRoot from 'withRoot';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 200,
    border: 'solid 1px white',
    padding: theme.spacing(3/4, 3),
    background: 'transparent',
    minWidth: props => props.compact ? undefined : 160,
    minHeight: 36
  }
}));

type Props = {
  children: React.ElementType,
  compact: boolean,
  [key: string]: any
};

const TransparentButton = ({ children, compact, ...rest }: Props) => {
  const classes = useStyles({ compact });

  return (
    <Button
      classes={{
        root: classes.root
      }}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default withRoot(TransparentButton);
