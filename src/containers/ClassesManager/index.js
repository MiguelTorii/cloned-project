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
import type { UserClasses } from '../../types/models';
import { getUserClasses } from '../../api/user';

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2
  }
});

type Props = {
  classes: Object,
  user: UserState,
  value: number,
  onChange: Function
};

type State = {
  userClasses: UserClasses
};

class ClassesManager extends React.PureComponent<Props, State> {
  state = {
    userClasses: []
  };

  componentDidMount = async () => {
    this.mounted = true;
    const {
      user: {
        data: { userId }
      }
    } = this.props;
    const userClasses = await getUserClasses({ userId });
    if (this.mounted) this.setState({ userClasses });
  };

  componentWillUnmount = () => {
    this.mounted = false;
  };

  mounted: boolean;

  render() {
    const {
      classes,
      user: {
        isLoading,
        error,
        data: { userId }
      },
      value,
      onChange
    } = this.props;
    const { userClasses } = this.state;
    if (isLoading) return <CircularProgress size={12} />;
    if (userId === '' || error)
      return 'Oops, there was an error loading your data, please try again.';

    return (
      <div className={classes.root}>
        <FormControl variant="outlined" fullWidth>
          <SelectValidator
            // native
            value={value}
            name="userClasses"
            label="User Classes"
            onChange={onChange}
            variant="outlined"
            validators={['required']}
            errorMessages={['this field is required']}
          >
            <MenuItem value="" />
            {userClasses.map(userClass => (
              <MenuItem key={userClass.classId} value={userClass.classId}>
                {userClass.className}
              </MenuItem>
            ))}
          </SelectValidator>
        </FormControl>
      </div>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(ClassesManager));
