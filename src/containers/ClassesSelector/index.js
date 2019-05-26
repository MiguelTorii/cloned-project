// @flow

import React from 'react';
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

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2
  }
});

type Props = {
  classes: Object,
  user: UserState,
  onChange: Function
};

type State = {
  userClasses: Array<SelectType>,
  value: string
};

class ClassesSelector extends React.PureComponent<Props, State> {
  state = {
    userClasses: [],
    value: ''
  };

  componentDidMount = async () => {
    this.mounted = true;
    const {
      user: {
        data: { userId, segment }
      }
    } = this.props;
    const classes = await getUserClasses({ userId });
    const userClasses = processClasses({ classes, segment });
    if (this.mounted) this.setState({ userClasses });
  };

  componentWillUnmount = () => {
    this.mounted = false;
  };

  handleChange = event => {
    const { classId, sectionId } = JSON.parse(event.target.value);
    this.setState({ value: event.target.value });
    const { onChange } = this.props;
    onChange({ classId, sectionId });
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
    const { userClasses, value } = this.state;
    if (isLoading) return <CircularProgress size={12} />;
    if (userId === '' || error)
      return 'Oops, there was an error loading your data, please try again.';

    return (
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
            </SelectValidator>
          </FormControl>
        </div>
      </ErrorBoundary>
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
