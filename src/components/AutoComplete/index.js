// @flow

import React from 'react';
import cx from 'classnames';
// $FlowFixMe
import AsyncPaginate from 'react-select-async-paginate';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import CancelIcon from '@material-ui/icons/Cancel';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import type { SelectType } from '../../types/models';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  input: {
    display: 'flex',
    padding: 10
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden'
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    backgroundColor: theme.palette.primary.main
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08
    )
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
  },
  placeholder: {
    position: 'absolute',
    left: 12,
    fontSize: 12,
    opacity: 0.7
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  errorLabel: {
    paddingLeft: 12
  }
});

function NoOptionsMessage({ selectProps, innerProps, children }) {
  return (
    <Typography
      color="textPrimary"
      className={selectProps.classes.noOptionsMessage}
      {...innerProps}
    >
      {children}
    </Typography>
  );
}

function LoadingMessage({ selectProps, innerProps, children }) {
  return (
    <Typography
      color="textPrimary"
      className={selectProps.classes.noOptionsMessage}
      {...innerProps}
    >
      {children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control({ selectProps, innerProps, innerRef, children }) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      InputProps={{
        inputComponent,
        inputProps: {
          className: selectProps.classes.input,
          inputRef: innerRef,
          children,
          ...innerProps
        }
      }}
      {...selectProps.textFieldProps}
    />
  );
}

function Option({
  innerRef,
  innerProps,
  isFocused,
  isSelected,
  children
  // data: { description = '' }
}) {
  return (
    <MenuItem
      buttonRef={innerRef}
      selected={isFocused}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400
      }}
      {...innerProps}
    >
      {children}
    </MenuItem>
  );
}

function Placeholder({ selectProps, innerProps, children }) {
  return (
    <Typography
      color="textPrimary"
      className={selectProps.classes.placeholder}
      {...innerProps}
    >
      {children}
    </Typography>
  );
}

function ValueContainer({ selectProps, children }) {
  return <div className={selectProps.classes.valueContainer}>{children}</div>;
}

function SingleValue({ selectProps, innerProps, children }) {
  return (
    <Typography
      color="textPrimary"
      className={selectProps.classes.singleValue}
      {...innerProps}
    >
      {children}
    </Typography>
  );
}

function MultiValue({ children, selectProps, isFocused, removeProps }) {
  return (
    <Chip
      tabIndex={-1}
      label={children}
      className={cx(selectProps.classes.chip, {
        [selectProps.classes.chipFocused]: isFocused
      })}
      onDelete={removeProps.onClick}
      deleteIcon={<CancelIcon {...removeProps} />}
    />
  );
}

function Menu({ selectProps, children, innerProps }) {
  return (
    <Paper square className={selectProps.classes.paper} {...innerProps}>
      {children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  SingleValue,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  ValueContainer,
  LoadingMessage
};

type Props = {
  classes: Object,
  theme: Object,
  page: number,
  values: Array<SelectType>,
  inputValue: string,
  label: string,
  placeholder: string,
  isMulti: boolean,
  error: boolean,
  errorText: string,
  onChange: Function,
  onLoadOptions: Function
};

class AutoComplete extends React.PureComponent<Props> {
  render() {
    const {
      classes,
      theme,
      page = 0,
      values,
      inputValue,
      label,
      placeholder,
      isMulti,
      error,
      errorText,
      onChange,
      onLoadOptions
    } = this.props;

    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit'
        }
      })
    };

    return (
      <div className={classes.root}>
        <NoSsr>
          <AsyncPaginate
            classes={classes}
            styles={selectStyles}
            textFieldProps={{
              label,
              InputLabelProps: {
                shrink: true
              }
            }}
            inputValue={inputValue}
            components={components}
            value={values}
            onChange={onChange}
            loadOptions={onLoadOptions}
            additional={{
              page
            }}
            placeholder={placeholder}
            isMulti={isMulti}
            isClearable
          />
          {error && (
            <FormHelperText error className={classes.errorLabel}>
              {errorText}
            </FormHelperText>
          )}
        </NoSsr>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(AutoComplete);
