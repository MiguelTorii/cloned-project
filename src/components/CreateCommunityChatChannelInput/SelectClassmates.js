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
// import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import InputAdornment from '@material-ui/core/InputAdornment'
import FormHelperText from '@material-ui/core/FormHelperText';
import Avatar from '@material-ui/core/Avatar';
// import Checkbox from '@material-ui/core/Checkbox';
import CancelIcon from '@material-ui/icons/Cancel';
import { emphasize } from '@material-ui/core/styles/colorManipulator';

import OnlineBadge from 'components/OnlineBadge';
import type { SelectType } from '../../types/models';

const Link = (props) => (
  <a href="https://www.circleinapp.com/waitlist" {...props}>
    Can't find your school? Click Here
  </a>
)

const styles = theme => ({
  root: {
    flexGrow: 1,
    '& .MuiInputAdornment-positionStart': {
      marginRight: 0
    },
  },
  input: {
    display: 'flex',
    padding: theme.spacing(0)
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden'
  },
  chip: {
    margin: theme.spacing(1/8),
    maxWidth: 160,
    backgroundColor: theme.circleIn.palette.modalBackground,
    color: 'white',
    borderRadius: 2
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08
    )
  },
  avatar: {
    width: 40,
    height: 40
  },
  noOptionsMessage: {
    padding: `${theme.spacing()}px ${theme.spacing(2)}px`
  },
  placeholder: {
    position: 'absolute',
    left: theme.spacing(0.5),
    fontSize: 12
  },
  paper: {
    zIndex: 100,
    left: 0,
    right: 0
  },
  paperAbsolute: {
    position: 'absolute',
  },
  paperRelative: {
    position: 'relative',
    backgroundColor: theme.circleIn.palette.modalBackground,
  },
  errorLabel: {
    paddingLeft: 12
  },
  classmates: {
    backgroundColor: theme.circleIn.palette.modalBackground
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
  const {
    isDisabled,
    autoFocus,
    textFieldProps: {
      relative,
      ...otherTextFieldProps
    }
  } = selectProps

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
          children: children[0],
          ...innerProps
        }
      }}
      relative={String(relative)}
      {...otherTextFieldProps}
    />
  );
}

function Option({ innerRef, innerProps, isFocused, isSelected, children, data, selectProps }) {
  const {
    avatar = '',
    initials = '',
    school = '',
    relationship = '',
    userId = 0,
    noAvatar = false,
    isOnline = false
  } = data || {};

  if (!noAvatar && (avatar !== '' || initials !== '' || school !== ''))
    return (
      <ListItem
        alignItems="center"
        button
        selected={isFocused}
        classes={{
          root: selectProps.classes.classmates
        }}
        style={{
          fontWeight: isSelected ? 500 : 400
        }}
        {...innerProps}
      >
        <ListItemAvatar>
          <OnlineBadge
            isOnline={isOnline}
            bgColorPath="circleIn.palette.modalBackground"
          >
            <Avatar
              alt={initials}
              className={selectProps.classes.avatar}
              src={avatar}
            >
              {initials}
            </Avatar>
          </OnlineBadge>
        </ListItemAvatar>
        <ListItemText
          id={`id-${userId}`}
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
      color={isDisabled ? "textSecondary" : "textPrimary"}
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
  const {
    inputValue,
    options = [],
    textFieldProps,
    isSchoolSearch
  } = selectProps;
  if (options.length === 0 && inputValue === '') return null;
  return (
    <Paper square className={cx(
      selectProps.classes.paper,
      textFieldProps.relative
        ? selectProps.classes.paperRelative
        : selectProps.classes.paperAbsolute
    )}
    {...innerProps}
    >
      {children}
      {isSchoolSearch && (
        <MenuItem>
          <Link
            style={{
              textDecoration: 'none',
              fontWeight: 400,
              color: '#5dcbfd'
            }}
            {...innerProps}
          />
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
  isDisabled: boolean,
  cacheUniq: any,
  isSchoolSearch: boolean,
  variant: ?string,
  onChange: Function,
  autoFocus: boolean,
  relative: boolean,
  id: string,
  onLoadOptions: Function
};

const SelectClassmates = ({
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
  variant,
  isDisabled = false,
  cacheUniq = '',
  isSchoolSearch = false,
  autoFocus,
  relative,
  id,
  onLoadOptions
}: Props) => {

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
    <div id={id} className={classes.root}>
      <NoSsr>
        <AsyncPaginate
          classes={classes}
          styles={selectStyles}
          textFieldProps={{
            relative,
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

export default withStyles(styles, { withTheme: true })(SelectClassmates);
