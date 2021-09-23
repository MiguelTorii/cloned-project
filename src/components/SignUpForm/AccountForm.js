/* eslint-disable no-restricted-syntax */
// @flow

import React from 'react';
import cx from 'classnames';
import {
  ValidatorForm,
  TextValidator,
  SelectValidator
} from 'react-material-ui-form-validator';
// import { DatePicker } from 'material-ui-pickers';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
// import FormHelperText from '@material-ui/core/FormHelperText';
import { grades } from '../../constants/clients';
import { styles } from '../_styles/SignUpForm/AccountForm';

type Props = {
  classes: Object,
  type: string,
  loading: boolean,
  hide: boolean,
  email: string,
  emailDomain: Array<string>,
  emailRestriction: boolean,
  onSubmit: Function
};

type State = {
  firstName: string,
  lastName: string,
  email: string,
  confirmPassword: string,
  password: string,
  grade: string | number
};

class AccountForm extends React.PureComponent<Props, State> {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    confirmPassword: '',
    password: '',
    grade: ''
  };

  componentDidMount = () => {
    const { email: propsEmail } = this.props;
    this.setState({ email: propsEmail });
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      const { password } = this.state;
      if (value !== password) {
        return false;
      }
      return true;
    });
    ValidatorForm.addValidationRule('isEmailRestricted', (value) => {
      const { emailDomain, emailRestriction } = this.props;
      if (emailRestriction) {
        let match = false;
        for (const domain of emailDomain) {
          if (
            value &&
            (value.endsWith(`.${domain}`) || value.endsWith(`@${domain}`))
          ) { match = true; }
        }
        return match;
      }
      return true;
    });
  };

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value });
  };

  handleSubmit = () => {
    const { onSubmit } = this.props;
    const { firstName, lastName, email, confirmPassword, password, grade } =
      this.state;
    const data = {
      action: 'Account',
      data: {
        firstName,
        lastName,
        email,
        confirmPassword,
        password,
        grade
      }
    };
    onSubmit(data);
  };

  render() {
    const { classes, type, hide, loading, emailDomain } = this.props;
    const { firstName, lastName, email, confirmPassword, password, grade } =
      this.state;
    return (
      <ValidatorForm
        onSubmit={this.handleSubmit}
        className={cx(classes.form, hide && classes.hide)}
      >
        <FormControl variant="outlined" fullWidth>
          <TextValidator
            variant="outlined"
            label="First Name"
            margin="normal"
            onChange={this.handleChange('firstName')}
            name="firstName"
            autoComplete="firstName"
            autoFocus
            fullWidth
            value={firstName}
            disabled={loading}
            validators={['required']}
            errorMessages={['First Name is required']}
          />
        </FormControl>
        <TextValidator
          variant="outlined"
          label="Last Name"
          margin="normal"
          onChange={this.handleChange('lastName')}
          name="lastName"
          autoComplete="lastName"
          fullWidth
          value={lastName}
          disabled={loading}
          validators={['required']}
          errorMessages={['Last Name is required']}
        />
        <TextValidator
          variant="outlined"
          label="Email Address"
          margin="normal"
          onChange={this.handleChange('email')}
          name="email"
          autoComplete="email"
          fullWidth
          value={email}
          disabled={loading}
          validators={['required', 'isEmail', 'isEmailRestricted']}
          errorMessages={[
            'Email Address is required',
            'Email is not valid',
            `Allowed domains: ${emailDomain.join(', ')}`
          ]}
        />
        <TextValidator
          variant="outlined"
          label="Password"
          margin="normal"
          onChange={this.handleChange('password')}
          name="password"
          fullWidth
          type="password"
          value={password}
          disabled={loading}
          validators={['required']}
          errorMessages={['Password is required']}
        />
        <TextValidator
          variant="outlined"
          label="Confirm Password"
          margin="normal"
          onChange={this.handleChange('confirmPassword')}
          name="confirmPassword"
          autoComplete="confirmPassword"
          fullWidth
          type="password"
          value={confirmPassword}
          disabled={loading}
          validators={['required', 'isPasswordMatch']}
          errorMessages={['Password is required', "Passwords don't match"]}
        />
        <FormControl
          variant="outlined"
          fullWidth
          className={classes.formControl}
        >
          <SelectValidator
            value={grade}
            name="grade"
            label="Year"
            onChange={this.handleChange('grade')}
            variant="outlined"
            validators={['required']}
            errorMessages={['Year is required']}
          >
            <MenuItem value="" />
            {(grades[type] || []).map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </SelectValidator>
        </FormControl>
        <div className={classes.wrapper}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
          >
            Submit
          </Button>
          {loading && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </div>
      </ValidatorForm>
    );
  }
}

export default withStyles(styles)(AccountForm);
