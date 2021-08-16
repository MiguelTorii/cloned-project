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
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import Avatar from '@material-ui/core/Avatar';
import CancelIcon from '@material-ui/icons/Cancel';
import ClearIcon from '@material-ui/icons/Clear';

import OnlineBadge from 'components/OnlineBadge';
import { ReactComponent as ChatSearchIcon } from 'assets/svg/chat-search.svg';
import styles from '../_styles/AutoComplete';

const Link = (props) => (
  <a href="https://www.circleinapp.com/waitlist" {...props}>
    Can't find your school? Click Here
  </a>
);

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
    textFieldProps: { relative, ...otherTextFieldProps },
    searchClassmate,
    classes
  } = selectProps;

  return (
    <TextField
      fullWidth
      classes={{
        root: searchClassmate && classes.searchInput
      }}
      variant="outlined"
      disabled={isDisabled}
      InputProps={{
        inputComponent,
        disableUnderline: searchClassmate,
        startAdornment: (
          <InputAdornment
            position="start"
            classes={{
              positionStart: searchClassmate && classes.startIcon
            }}
          >
            {searchClassmate ? <ChatSearchIcon /> : <div />}
          </InputAdornment>
        ),
        inputProps: {
          autoFocus,
          className: searchClassmate
            ? classes.addClassmateInput
            : classes.input,
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

function Option({
  innerRef,
  innerProps,
  isFocused,
  isSelected,
  children,
  data
}) {
  const {
    avatar = '',
    initials = '',
    school = '',
    noAvatar = false,
    relationship = '',
    isOnline = false
  } = data || {};

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
          <OnlineBadge
            isOnline={isOnline}
            bgColorPath="circleIn.palette.feedBackground"
          >
            <Avatar alt={initials} src={avatar}>
              {initials}
            </Avatar>
          </OnlineBadge>
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
  const { isDisabled, classes, searchClassmate } = selectProps;

  return (
    <Typography
      color={isDisabled ? 'textSecondary' : 'textPrimary'}
      className={
        searchClassmate ? classes.addClassmatePlaceholder : classes.placeholder
      }
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
  const { classes, searchClassmate } = selectProps;
  if (avatar !== '' || initials !== '')
    return (
      <Chip
        avatar={
          !searchClassmate ? (
            <Avatar alt={initials} src={avatar}>
              {initials}
            </Avatar>
          ) : null
        }
        tabIndex={-1}
        label={children}
        className={cx(
          searchClassmate ? classes.addClassmateChip : classes.chip,
          {
            [classes.chipFocused]: isFocused
          }
        )}
        onDelete={removeProps.onClick}
        deleteIcon={
          searchClassmate ? (
            <ClearIcon {...removeProps} />
          ) : (
            <CancelIcon {...removeProps} />
          )
        }
      />
    );
  return (
    <Chip
      tabIndex={-1}
      label={children}
      className={cx(searchClassmate ? classes.addClassmateChip : classes.chip, {
        [classes.chipFocused]: isFocused
      })}
      onDelete={removeProps.onClick}
      deleteIcon={
        searchClassmate ? (
          <ClearIcon {...removeProps} />
        ) : (
          <CancelIcon {...removeProps} />
        )
      }
    />
  );
}

function Menu({ selectProps, children, innerProps }) {
  const {
    inputValue,
    options = [],
    textFieldProps,
    isSchoolSearch,
    searchClassmate,
    classes
  } = selectProps;
  if (options.length === 0 && inputValue === '') return null;
  return (
    <Paper
      square
      className={cx(
        searchClassmate ? classes.addClassmatePaper : classes.paper,
        textFieldProps.relative ? classes.paperRelative : classes.paperAbsolute
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
  searchClassmate: boolean,
  isDisabled: boolean,
  cacheUniq: any,
  isSchoolSearch: boolean,
  variant: ?string,
  onChange: Function,
  autoFocus: boolean,
  relative: boolean,
  id: string,
  onLoadOptions: Function,
  debounceTimeout: number
};

const AutoComplete = ({
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
  searchClassmate = false,
  onChange,
  variant,
  isDisabled = false,
  cacheUniq = '',
  isSchoolSearch = false,
  autoFocus,
  relative,
  id,
  onLoadOptions,
  debounceTimeout = 500
}: Props) => {
  const selectStyles = {
    input: (base) => ({
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
            variant
          }}
          debounceTimeout={debounceTimeout}
          inputValue={inputValue}
          components={components}
          searchClassmate={searchClassmate}
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
};

export default withStyles(styles, { withTheme: true })(AutoComplete);
