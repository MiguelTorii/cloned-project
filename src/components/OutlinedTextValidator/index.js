// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { TextValidator } from 'react-material-ui-form-validator';
import FormControl from '@material-ui/core/FormControl';

import { styles } from '../_styles/OutlinedTextValidator';

type Props = {
  classes: Object,
  label: string,
  name: string,
  value: string,
  multiline?: boolean,
  rows?: number,
  autoFocus?: boolean,
  validators: Array<string>,
  errorMessages: Array<string>,
  disabled?: boolean,
  variant: string,
  onChange: Function
};

class OutlinedTextValidator extends React.PureComponent<Props> {
  static defaultProps = {
    multiline: false,
    rows: 4,
    autoFocus: false,
    disabled: false
  };

  render() {
    const {
      classes,
      label,
      name,
      value,
      multiline,
      rows,
      validators,
      errorMessages,
      autoFocus,
      disabled,
      variant,
      onChange
    } = this.props;

    return (
      <div className={classes.root}>
        <FormControl variant="outlined" fullWidth>
          <TextValidator
            label={label}
            multiline={multiline}
            rows={rows}
            autoFocus={autoFocus}
            variant={variant || "outlined"}
            onChange={onChange(name)}
            name={name}
            fullWidth
            value={value}
            validators={validators}
            errorMessages={errorMessages}
            disabled={disabled}
          />
        </FormControl>
      </div>
    );
  }
}

export default withStyles(styles)(OutlinedTextValidator);
