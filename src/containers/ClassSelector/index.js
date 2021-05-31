// @flow

import React, { useCallback, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { ReactComponent as ClassFeedIcon } from 'assets/svg/myclass-active.svg';

import AddRemoveClasses from 'components/AddRemoveClasses';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import { processClasses } from './utils';
import ErrorBoundary from '../ErrorBoundary';
import RequestClass from '../RequestClass';

const styles = theme => ({
  formControl: {
    width: '100%'
  },
  root: {
    padding: theme.spacing(2, 0),
    maxWidth: 400
  },
  newClass: {
    color: theme.circleIn.palette.action
  },
  classDropdown: {
    paddingTop: `${theme.spacing(1)}px !important`,
    paddingBottom: `${theme.spacing(1)}px !important`,
  },
  classList: {
    backgroundColor: theme.circleIn.palette.formBackground,
    borderRadius: theme.spacing(1)
  },
  classIcon: {
    marginTop: `0px !important`
  },
  optionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  mr1: {
    marginRight: theme.spacing(1)
  }
});

type Props = {
  classes: Object,
  user: UserState,
  onChange: Function,
  classId: ?number,
  label: ?string,
  variant: ?string,
  sectionId: ?number,
  location: {
    pathname: string
  }
};

const ClassesSelector = ({
  classes,
  user: {
    isLoading,
    error,
    data: { segment, userId },
    userClasses: {
      classList,
    }
  },
  onChange,
  classId,
  router: {
    location: {
      pathname
    }
  },
  sectionId
}: Props) => {
  const [userClasses, setUserClasses] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const [openRequestClass, setOpenRequestClass] = useState(false)

  useEffect(() => {
    if (classId && sectionId) setValue(JSON.stringify({ classId, sectionId }))
  }, [classId, sectionId])

  const handleLoadClasses = useCallback(async () => {
    try {
      const userClasses = processClasses({ classes: classList, segment });
      setUserClasses(userClasses)
      if (classId && sectionId) setValue(JSON.stringify({ classId, sectionId }))
    } catch (err) {
      console.log(err);
    }
  }, [classId, classList, sectionId, segment])

  useEffect(() => {
    const init = async () => {
      if (pathname.includes('/edit')) setIsEdit(true)
      await handleLoadClasses()
    }

    init()
  }, [handleLoadClasses, pathname])

  const handleChange = useCallback((event, option) => {
    if (!option) {
      setValue(null)
      onChange({ classId: 0, sectionId: 0 });
    } else {
      const { value: selectedClass } = option;
      if (selectedClass === 'new') {
        setOpen(true)
        return;
      }
      setValue(selectedClass)
      const { classId, sectionId } = JSON.parse(selectedClass);
      onChange({ classId, sectionId });
    }
  }, [onChange])

  const handleCloseManageClasses = useCallback(async () => {
    setOpen(false)
    await handleLoadClasses();
  }, [handleLoadClasses])

  const handleOpenRequestClass = useCallback(() => {
    handleCloseManageClasses();
    setOpenRequestClass(true)
  }, [handleCloseManageClasses])

  const handleCloseRequestClass = useCallback(() => {
    setOpenRequestClass(false)
  }, [])


  if (isLoading) return <CircularProgress size={12} />;
  if (userId === '' || error)
    return 'Oops, there was an error loading your data, please try again.';

  return (
    <>
      <ErrorBoundary>
        <div className={classes.root}>
          <FormControl className={classes.classList} variant="outlined" fullWidth>
            <Autocomplete
              id="select-class"
              size="small"
              disabled={isEdit}
              classes={{
                inputRoot: classes.classDropdown
              }}
              options={userClasses}
              getOptionLabel={(option) => option.label}
              onChange={handleChange}
              renderOption={(option) => {
                return (<div className={classes.optionItem}>
                  {value === option.value
                    ? <CheckCircleIcon className={classes.mr1} />
                    : <RadioButtonUncheckedIcon className={classes.mr1} />}
                  <span>{option.label}</span>
                </div>
                )}
              }
              renderInput={params => (
                <TextField
                  {...params}
                  variant="filled"
                  placeholder="Choose a class"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: <InputAdornment className={classes.classIcon} position="start">
                      <ClassFeedIcon />
                    </InputAdornment>
                  }}
                />
              )}
            />
          </FormControl>
        </div>
      </ErrorBoundary>
      <ErrorBoundary>
        <AddRemoveClasses
          open={open}
          onClose={handleCloseManageClasses}
          onOpenRequestClass={handleOpenRequestClass}
        />
      </ErrorBoundary>
      <ErrorBoundary>
        <RequestClass
          open={openRequestClass}
          onClose={handleCloseRequestClass}
        />
      </ErrorBoundary>
    </>
  );
}

const mapStateToProps = ({ user, router }: StoreState): {} => ({
  user,
  router
});

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(ClassesSelector));
