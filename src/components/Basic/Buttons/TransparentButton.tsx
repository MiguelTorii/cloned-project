// @flow

import React from 'react';
import Button from '@material-ui/core/Button';
import withRoot from 'withRoot';
import { useStyles } from '../../_styles/Basic/Buttons/TransparentButton';

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
