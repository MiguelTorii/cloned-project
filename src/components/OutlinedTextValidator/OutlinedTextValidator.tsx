import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { TextValidator } from "react-material-ui-form-validator";
import FormControl from "@material-ui/core/FormControl";
import { styles } from "../_styles/OutlinedTextValidator";
type Props = {
  classes: Record<string, any>;
  label: string;
  placeholder: string;
  name: string;
  value: string;
  multiline?: boolean;
  rows?: number;
  autoFocus?: boolean;
  validators: Array<string>;
  errorMessages: Array<string>;
  disabled?: boolean;
  variant: string;
  onChange: (...args: Array<any>) => any;
  labelClass: string;
  inputClass: string;
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
      placeholder,
      name,
      value,
      multiline,
      rows,
      validators,
      errorMessages,
      autoFocus,
      disabled,
      variant,
      onChange,
      labelClass,
      inputClass
    } = this.props;
    return <div className={classes.root}>
        <div className={labelClass}>{label}</div>
        <FormControl variant="outlined" classes={{
        root: classes.outlineInput
      }} fullWidth>
          <TextValidator className={inputClass} placeholder={placeholder} multiline={multiline} rows={rows} autoFocus={autoFocus} variant={variant || 'outlined'} onChange={onChange(name)} name={name} fullWidth value={value} validators={validators} errorMessages={errorMessages} disabled={disabled} />
        </FormControl>
      </div>;
  }

}

export default withStyles(styles)(OutlinedTextValidator);