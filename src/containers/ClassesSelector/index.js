// @flow

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { SelectValidator } from 'react-material-ui-form-validator';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import type { SelectType } from '../../types/models';
import { getUserClasses } from '../../api/user';
import { processClasses } from './utils';
import ErrorBoundary from '../ErrorBoundary';
import ClassesManager from '../ClassesManager';

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2
  },
  newClass: {
    color: theme.circleIn.palette.action
  }
});

type Props = {
  classes: Object,
  user: UserState,
  onChange: Function
};

type State = {
  userClasses: Array<SelectType>,
  value: string,
  open: boolean
};

class ClassesSelector extends React.PureComponent<Props, State> {
  state = {
    userClasses: [],
    value: '',
    open: false
  };

  componentDidMount = async () => {
    this.mounted = true;
    await this.handleLoadClasses();
  };

  componentWillUnmount = () => {
    this.mounted = false;
  };

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

  mounted: boolean;

  render() {
    const {
      classes,
      user: {
        isLoading,
        error,
        data: { userId }
      }
    } = this.props;
    const { userClasses, value, open } = this.state;
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
                value={value}
                name="userClasses"
                label="User Classes"
                onChange={this.handleChange}
                variant="outlined"
                validators={['required']}
                errorMessages={['User Classes is required']}
              >
                <MenuItem value="" />
                {userClasses.map(userClass => (
                  <MenuItem key={userClass.value} value={userClass.value}>
                    {userClass.label}
                  </MenuItem>
                ))}
                <MenuItem value="new" className={classes.newClass}>
                  Add Classes
                </MenuItem>
              </SelectValidator>
            </FormControl>
          </div>
        </ErrorBoundary>
        <ErrorBoundary>
          <ClassesManager open={open} onClose={this.handleCloseManageClasses} />
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
