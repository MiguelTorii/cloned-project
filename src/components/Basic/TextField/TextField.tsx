import React from "react";
import { StyledTextField } from "../../_styles/Basic/TextField/index";
type Props = Record<string, any>;

const TextField = ({
  variant,
  ...rest
}: Props) => <StyledTextField variant={variant || 'outlined'} {...rest} />;

export default TextField;