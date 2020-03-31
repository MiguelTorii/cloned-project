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
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import InputAdornment from '@material-ui/core/InputAdornment'
import FormHelperText from '@material-ui/core/FormHelperText';
import Avatar from '@material-ui/core/Avatar';
import CancelIcon from '@material-ui/icons/Cancel';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import type { SelectType } from '../../types/models';

const Link = React.forwardRef(({ href, ...props }, ref) => (
  <a ref={ref} href="https://www.circleinapp.com/waitlist" {...props}>
    Can't find your school? Click Here
  </a>
));

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
    margin: `${theme.spacing(1/2)}px ${theme.spacing(1/4)}px`,
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
    padding: `${theme.spacing()}px ${theme.spacing(2)}px`
  },
  placeholder: {
    position: 'absolute',
    left: 22,
    fontSize: 12,
    opacity: 0.7
  },
  paper: {
    position: 'absolute',
    zIndex: 100,
    marginTop: theme.spacing(),
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
  const {isDisabled, autoFocus} = selectProps

  return (
    <TextField
      fullWidth
      variant="outlined"
      disabled={isDisabled}
      InputProps={{
        inputComponent,
        startAdornment: <InputAdornment position='start'><div /></InputAdornment>,
        inputProps: {
          autoFocus,
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
  children,
  data
}) {
  const { avatar = '', initials = '', school = '', noAvatar = false, relationship = '' } =
    data || {};
  if (!noAvatar && (avatar !== '' || initials !== '' || school !== ''))
    return (
      <ListItem
        alignItems="flex-start"
        button
        selected={isFocused}
        style={{
          fontWeight: isSelected ? 500 : 400
        }}
        {...innerProps}
      >
        <ListItemAvatar>
          <Avatar alt={initials} src={avatar}>
            {initials}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={children}
          secondary={relationship}
          secondaryTypographyProps={{ color: 'textPrimary' }}
        />
      </ListItem>
    );
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
  const { isDisabled } = selectProps

  return (
    <Typography
      color={isDisabled ? "disabled" : "textPrimary"}
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

function MultiValue({ children, selectProps, isFocused, removeProps, data }) {
  const { avatar = '', initials = '' } = data || {};
  if (avatar !== '' || initials !== '')
    return (
      <Chip
        avatar={
          <Avatar alt={initials} src={avatar}>
            {initials}
          </Avatar>
        }
        tabIndex={-1}
        label={children}
        className={cx(selectProps.classes.chip, {
          [selectProps.classes.chipFocused]: isFocused
        })}
        onDelete={removeProps.onClick}
        deleteIcon={<CancelIcon {...removeProps} />}
      />
    );
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
  const { inputValue, options = [], isSchoolSearch } = selectProps;

  if (options.length === 0 && inputValue === '') return null;
  return (
    <Paper square className={selectProps.classes.paper} {...innerProps}>
      {children}
      {isSchoolSearch && (
        <MenuItem
          component={Link}
          style={{
            fontWeight: 400,
            color: '#5dcbfd'
          }}
          {...innerProps}
        >
          Can't find your school? Click Here
        </MenuItem>
      )}
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
  isDisabled?: boolean,
  cacheUniq?: any,
  isSchoolSearch?: boolean,
  variant: ?string,
  onChange: Function,
  autoFocus: boolean,
  onLoadOptions: Function
};

class AutoComplete extends React.PureComponent<Props> {
  static defaultProps = {
    isDisabled: false,
    cacheUniq: '',
    isSchoolSearch: false
  };

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
      isDisabled,
      cacheUniq,
      isSchoolSearch,
      onChange,
      variant,
      autoFocus,
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
              variant,
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
            autoFocus={autoFocus}
            isDisabled={isDisabled}
            cacheUniq={cacheUniq}
            noOptionsMessage={({ inputValue: input }) => {
              if (input !== '') return 'No results, please try again';
              return '';
            }}
            isSchoolSearch={isSchoolSearch}
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
