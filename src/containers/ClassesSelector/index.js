// @flow

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { SelectValidator } from 'react-material-ui-form-validator';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import AddRemoveClasses from 'components/AddRemoveClasses';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import type { SelectType } from '../../types/models';
import { getUserClasses } from '../../api/user';
import { processClasses } from './utils';
import ErrorBoundary from '../ErrorBoundary';
import RequestClass from '../RequestClass';

const styles = theme => ({
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
  classes: Object,
  user: UserState,
  onChange: Function,
  classId: ?number,
  label: ?string,
  variant: ?string,
  sectionId: ?number
};

type State = {
  userClasses: Array<SelectType>,
  value: string,
  open: boolean,
  isEdit: boolean,
  openRequestClass: boolean
};

class ClassesSelector extends React.PureComponent<Props, State> {
  state = {
    userClasses: [],
    isEdit: false,
    value: '',
    open: false,
    openRequestClass: false
  };

  componentWillUnmount = () => {
    this.mounted = false;
  };

  componentDidMount = async () => {
    this.mounted = true;
    const { location: {pathname}} = window
    if (pathname.includes('/edit')) this.setState({ isEdit: true })
    await this.handleLoadClasses();
  };

  componentWillReceiveProps = nextProps => {
    const {classId, sectionId} = nextProps
    if (classId && sectionId) this.setState({value: JSON.stringify({classId, sectionId})})
  }

  handleLoadClasses = async () => {
    try {
      const {
        user: {
          data: { userId, segment }
        }
      } = this.props;
      const { classes } = await getUserClasses({ userId });

      const userClasses = processClasses({ classes, segment });
      if (this.mounted) this.setState({ userClasses });
    } catch (err) {
      console.log(err);
    }
  };

  handleChange = event => {
    const { onChange } = this.props;
    const { value } = event.target;
    if (value === 'new') {
      this.setState({ open: true });
      return;
    }
    try {
      this.setState({ value });
      const { classId, sectionId } = JSON.parse(value);
      onChange({ classId, sectionId });
    } catch (err) {
      onChange({ classId: 0, sectionId: null });
    }
  };

  handleCloseManageClasses = async () => {
    this.setState({ open: false });
    await this.handleLoadClasses();
  };

  handleOpenRequestClass = () => {
    this.handleCloseManageClasses();
    this.setState({ openRequestClass: true });
  };

  handleCloseRequestClass = () => {
    this.setState({ openRequestClass: false });
  };

  mounted: boolean;

  render() {
    const {
      classes,
      variant,
      label,
      user: {
        userClasses: { canAddClasses },
        isLoading,
        error,
        data: { userId }
      },
    } = this.props;
    const { userClasses, value, open, isEdit, openRequestClass } = this.state;
    if (isLoading) return <CircularProgress size={12} />;
    if (userId === '' || error)
      return 'Oops, there was an error loading your data, please try again.';

    return (
      <Fragment>
        <ErrorBoundary>
          <div className={classes.root}>
            <FormControl variant="outlined" fullWidth>
              <SelectValidator
                // native
                className={classes.formControl}
                value={value}
                name="userClasses"
                disabled={isEdit}
                onChange={this.handleChange}
                variant={variant || "outlined"}
                label={label}
                validators={['required']}
                errorMessages={['User Classes is required']}
              >
                <MenuItem value="" />
                {userClasses.map(userClass => (
                  <MenuItem key={userClass.value} value={userClass.value}>
                    {userClass.label}
                  </MenuItem>
                ))}
                {canAddClasses && <MenuItem value="new" className={classes.newClass}>
                 Add Classes
                </MenuItem>}
              </SelectValidator>
            </FormControl>
          </div>
        </ErrorBoundary>
        <ErrorBoundary>
          <AddRemoveClasses
            open={open}
            onClose={this.handleCloseManageClasses}
            onOpenRequestClass={this.handleOpenRequestClass}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <RequestClass
            open={openRequestClass}
            onClose={this.handleCloseRequestClass}
          />
        </ErrorBoundary>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(ClassesSelector));
