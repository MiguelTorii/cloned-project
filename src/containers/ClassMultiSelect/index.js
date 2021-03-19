// @flow
/* eslint-disable no-use-before-define */
import React, { useCallback, useMemo, memo } from 'react';
import { connect } from 'react-redux';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import type { State as StoreState } from 'types/state';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Tooltip from 'containers/Tooltip'
import Paper from '@material-ui/core/Paper'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  },
  chip: {
    color: theme.circleIn.palette.primaryText1
  },
  dropdownIcon: {
    color: theme.circleIn.palette.brand
  }
}));

const ClassMultiSelect = ({
  user,
  selected,
  allLabel,
  placeholder = '',
  containerStyle,
  externalOptions,
  variant,
  textFieldStyle = '',
  noEmpty,
  onSelect,
}) => {
  const classes = useStyles();

  const options = useMemo(() => {
    if (externalOptions) return externalOptions
    try {
      const classList = {}
      user.userClasses.classList.forEach(cl => {
        if (
          cl.section &&
          cl.section.length > 0 &&
          cl.className &&
          cl.bgColor
        )
          cl.section.forEach(s => {
            classList[s.sectionId] = cl
          })
      })
      return Object.keys(classList).map(sectionId => {
        return {
          ...classList[sectionId],
          sectionId: Number(sectionId),
        }
      })
    } finally {/* NONE */}
  }, [externalOptions, user.userClasses.classList])

  const onChange = useCallback((_, value) => {
    if (noEmpty && value.length === 0) return
    if (value.find(o => o.value === 'all')) {
      onSelect(options)
    }
    else {
      onSelect(value)
    }
  }, [noEmpty, onSelect, options])

  const allSelected = useMemo(() => (
    selected.length === options.length
  ), [options.length, selected.length])

  return (
    <div className={containerStyle || classes.root}>
      <Autocomplete
        multiple
        PaperComponent={props => (
          <Tooltip
            id={9051}
            placement="right"
            text="Simply Select All, or just check the boxes of the classes to post."
          >
            <Paper {...props} />
          </Tooltip>
        )}
        disableClearable={noEmpty}
        openOnFocus
        getOptionSelected={(option, value) => {
          return value.classId === option.classId && value.sectionId === option.sectionId
        }}
        limitTags={2}
        id="tags-filled"
        onChange={onChange}
        value={selected}
        options={[
          { className: 'All Classes', value: 'all' },
          ...options
        ]}
        defaultValue={[]}
        getOptionLabel={o => o.className}
        disableCloseOnSelect
        renderOption={(option, { selected }) => (
          <React.Fragment>
            {option.value !== 'all' && (
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
            )}
            {option.className}
          </React.Fragment>
        )}
        renderTags={(value, getTagProps) => {
          if (allSelected) return allLabel || 'All Classes Selected'
          return value.map((option, index) => option && (
            <Chip
              variant="outlined"
              classes={{
                root: classes.chip
              }}
              label={option.className}
              style={{ backgroundColor: option.bgColor }}
              {...getTagProps({ index })}
            />
          ))
        }
        }
        popupIcon={
          <Tooltip
            id={9056}
            placement="right"
            okButton='Got it!'
            delay={500}
            totalSteps={2}
            completedSteps={1}
            text="To check out your Class Leaderboard, select one class at a time... 🏆"
          >
            <Tooltip
              id={9055}
              placement="right"
              okButton='Got it!'
              totalSteps={2}
              delay={500}
              completedSteps={0}
              text="You can now easily switch to see all your classes using this drop-down menu! 🎉"
            >
              <ArrowDropDownIcon className={classes.dropdownIcon} />
            </Tooltip>
          </Tooltip>
        }
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth={!textFieldStyle}
            className={textFieldStyle}
            placeholder={allSelected ? '' : placeholder}
            variant={variant || "outlined"}
            label=''
          />
        )}
      />
    </div>
  );
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default memo(connect(
  mapStateToProps,
  null
)(ClassMultiSelect))

