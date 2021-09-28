import React, { useCallback, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { SelectValidator } from 'react-material-ui-form-validator';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import AddRemoveClasses from '../../components/AddRemoveClasses/AddRemoveClasses';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import { processClasses } from './utils';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import RequestClass from '../RequestClass/RequestClass';

const styles = (theme) => ({
  formControl: {
    width: '100%'
  },
  root: {
    padding: theme.spacing(2)
  },
  newClass: {
    color: theme.circleIn.palette.action
  }
});

type Props = {
  classes?: Record<string, any>;
  user?: UserState;
  onChange?: (...args: Array<any>) => any;
  classId?: number | null | undefined;
  label?: string | null | undefined;
  variant?: string | null | undefined;
  sectionId?: number | null | undefined;
  location?: {
    pathname: string;
  };
  router?: {
    location: {
      pathname: string;
    };
  };
  disabled?: boolean;
};

const ClassesSelector = ({
  classes,
  user: {
    isLoading,
    error,
    data: { segment, userId },
    userClasses: { classList, canAddClasses }
  },
  onChange,
  classId,
  label,
  router: {
    location: { pathname }
  },
  variant,
  sectionId
}: Props) => {
  const [userClasses, setUserClasses] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [openRequestClass, setOpenRequestClass] = useState(false);
  useEffect(() => {
    if (classId && sectionId) {
      setValue(
        JSON.stringify({
          classId,
          sectionId
        })
      );
    }
  }, [classId, sectionId]);
  const handleLoadClasses = useCallback(async () => {
    try {
      const userClasses = processClasses({
        classes: classList,
        segment
      });
      setUserClasses(userClasses);

      if (classId && sectionId) {
        setValue(
          JSON.stringify({
            classId,
            sectionId
          })
        );
      }
    } catch (err) {
      console.log(err);
    }
  }, [classId, classList, sectionId, segment]);
  useEffect(() => {
    const init = async () => {
      if (pathname.includes('/edit')) {
        setIsEdit(true);
      }

      await handleLoadClasses();
    };

    init();
  }, [handleLoadClasses, pathname]);
  const handleChange = useCallback(
    (event) => {
      const { value } = event.target;

      if (value === 'new') {
        setOpen(true);
        return;
      }

      try {
        setValue(value);
        const { classId, sectionId } = JSON.parse(value);
        onChange({
          classId,
          sectionId
        });
      } catch (err) {
        onChange({
          classId: 0,
          sectionId: null
        });
      }
    },
    [onChange]
  );
  const handleCloseManageClasses = useCallback(async () => {
    setOpen(false);
    await handleLoadClasses();
  }, [handleLoadClasses]);
  const handleOpenRequestClass = useCallback(() => {
    handleCloseManageClasses();
    setOpenRequestClass(true);
  }, [handleCloseManageClasses]);
  const handleCloseRequestClass = useCallback(() => {
    setOpenRequestClass(false);
  }, []);

  if (isLoading) {
    return <CircularProgress size={12} />;
  }

  if (userId === '' || error) {
    return 'Oops, there was an error loading your data, please try again.';
  }

  return (
    <>
      <ErrorBoundary>
        <div className={classes.root}>
          <FormControl variant="outlined" fullWidth>
            <SelectValidator
              className={classes.formControl}
              value={value}
              name="userClasses"
              disabled={isEdit}
              onChange={handleChange}
              variant={variant || 'outlined'}
              multiple
              label={label}
              validators={['required']}
              errorMessages={['User Classes is required']}
            >
              <MenuItem value="" />
              {userClasses.map((userClass) => (
                <MenuItem key={userClass.value} value={userClass.value}>
                  {userClass.label}
                </MenuItem>
              ))}
              {canAddClasses && (
                <MenuItem value="new" className={classes.newClass}>
                  Add Classes
                </MenuItem>
              )}
            </SelectValidator>
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
        <RequestClass open={openRequestClass} onClose={handleCloseRequestClass} />
      </ErrorBoundary>
    </>
  );
};

const mapStateToProps = ({ user, router }: StoreState): {} => ({
  user,
  router
});

export default connect<{}, {}, Props>(
  mapStateToProps,
  null
)(withStyles(styles as any)(ClassesSelector as any));
