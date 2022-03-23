import React from 'react';

import { StyledTextField } from 'components/_styles/Basic/TextField';

type Props = Record<string, any>;

const TextField = ({ variant, ...rest }: Props) => (
  <StyledTextField variant={variant || 'outlined'} {...rest} />
);

export default TextField;
