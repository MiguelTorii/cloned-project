/* eslint-disable no-restricted-syntax */
// @flow

import React, { Fragment } from 'react';
import {
  ValidatorForm,
  TextValidator,
  SelectValidator
} from 'react-material-ui-form-validator';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import withRoot from '../../withRoot';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import ErrorBoundary from '../ErrorBoundary';
import Onboarding from '../Onboarding';
import Dialog, { dialogStyle } from '../../components/Dialog';
import { grades } from '../../constants/clients';
import { updateProfile as updateUserProfile } from '../../api/user';
import * as userActions from '../../actions/user';
import * as signInActions from '../../actions/sign-in';

const styles = theme => ({
  root: {
    padding: theme.spacing(2)
  },
  dialog: {
    ...dialogStyle
  },
  form: {
    width: '100%' // Fix IE 11 issue.
  },
  wrapper: {
    margin: theme.spacing(),
    position: 'relative'
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
});

type Props = {
  classes: Object,
  user: UserState,
  checkUserSession: Function,
  updateOnboarding: Function
};

type State = {
  open: boolean,
  loading: boolean,
  firstName: string,
  lastName: string,
  grade: string | number,
  email: string
};

class UpdateLMSUser extends React.PureComponent<Props, State> {
  state = {
    open: false,
    loading: false,
    firstName: '',
    lastName: '',
    grade: '',
    email: '',
  };

  componentDidMount = () => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;

    if (userId !== '') this.handleCheckUpdate();
  };

  componentDidUpdate = prevProps => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;
    const {
      user: {
        data: { userId: prevUserId }
      }
    } = prevProps;

    if (userId !== '' && prevUserId === '') this.handleCheckUpdate();
  };

  handleCheckUpdate = () => {
    const {
      user: {
        data: { updateProfile }
      }
    } = this.props;
    if (updateProfile.length > 0) this.setState({ open: true });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleSubmit = async () => {
    this.setState({ loading: true });
    try {
      const {
        user: {
          data: { userId, updateProfile }
        }
      } = this.props;
      const { firstName, lastName, grade, email } = this.state;
      const fields = [];
      for (const profileItem of updateProfile) {
        const item = { field: profileItem.field, updated_value: '' };

        switch (profileItem.field) {
        case 'first_name':
          item.updated_value = firstName;
          break;
        case 'last_name':
          item.updated_value = lastName;
          break;
        case 'grade':
          item.updated_value = grade.toString();
          break;
        case 'email':
          item.updated_value = email;
          break;
        default:
          item.updated_value = '';
          break;
        }
        fields.push(item);
      }
      await updateUserProfile({ userId, fields });
      const { checkUserSession } = this.props;
      await checkUserSession();

      this.setState({ open: false, loading: false });
    } catch (err) {
      this.setState({ loading: false });
    }
  };

  render() {
    const {
      classes,
      user: {
        data: { userId, updateProfile, segment },
        syncData: { viewedOnboarding }
      },
      updateOnboarding
    } = this.props;

    if (userId === '') return null;

    const {
      open,
      loading,
      firstName,
      lastName,
      grade,
      email,
    } = this.state;

    const renderForm = (
      <Fragment>
        {updateProfile.map(({ field }) => {
          switch (field) {
          case 'first_name':
            return (
              <TextValidator
                key={field}
                label="First Name"
                margin="normal"
                variant="outlined"
                onChange={this.handleChange('firstName')}
                name="firstName"
                autoComplete="firstName"
                autoFocus
                fullWidth
                value={firstName}
                disabled={loading}
                validators={['required']}
                errorMessages={['first name is required']}
              />
            );
          case 'last_name':
            return (
              <TextValidator
                key={field}
                label="Last Name"
                margin="normal"
                variant="outlined"
                onChange={this.handleChange('lastName')}
                name="lastName"
                autoComplete="lastName"
                autoFocus
                fullWidth
                value={lastName}
                disabled={loading}
                validators={['required']}
                errorMessages={['last name is required']}
              />
            );
          case 'grade':
            return (
              <SelectValidator
                key={field}
                value={grade}
                fullWidth
                name="grade"
                label="Year"
                onChange={this.handleChange('grade')}
                variant="outlined"
                margin="normal"
                disabled={loading}
                validators={['required']}
                errorMessages={['Year is required']}
              >
                <MenuItem value="" />
                {(grades[segment] || []).map(item => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </SelectValidator>
            );
          case 'email':
            return (
              <TextValidator
                key={field}
                label="Email"
                margin="normal"
                variant="outlined"
                onChange={this.handleChange('email')}
                name="email"
                autoComplete="email"
                autoFocus
                fullWidth
                value={email}
                disabled={loading}
                validators={['required', 'isEmail']}
                errorMessages={['email is required', 'email is not valid']}
              />
            );
          default:
            return null;
          }
        })}
      </Fragment>
    );

    return (
      <ErrorBoundary>
        <Dialog
          open={open}
          disableBackdropClick
          disableEscapeKeyDown
          okTitle="Update"
          onOk={this.handleSubmit}
          showActions
          title="Update Profile"
        >
          <div className={classes.dialog}>
            {loading && (
              <CircularProgress
                size={24}
                className={classes.buttonProgress}
              />
            )}
            <ValidatorForm
              instantValidate
              onSubmit={this.handleSubmit}
              className={classes.form}
            >
              {renderForm}
            </ValidatorForm>
          </div>
        </Dialog>
        <Onboarding
          open={viewedOnboarding !== null && !viewedOnboarding}
          updateOnboarding={updateOnboarding}
          userId={userId}
        />
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      checkUserSession: signInActions.checkUserSession,
      updateOnboarding: userActions.updateOnboarding,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRoot(withStyles(styles)(UpdateLMSUser)));
