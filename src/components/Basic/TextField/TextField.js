// @flow

import React from 'react';
import { StyledTextField } from '../../_styles/Basic/TextField/index';

type Props = {
  [key: string]: any
};

const TextField = ({ variant, ...rest }: Props) => (
  <StyledTextField variant={variant || 'outlined'} {...rest} />
);

export default TextField;
