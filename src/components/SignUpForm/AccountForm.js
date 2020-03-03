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
import green from '@material-ui/core/colors/green';
import { grades } from '../../constants/clients';

const styles = theme => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing()
  },
  hide: {
    display: 'none'
  },
  actions: {
    display: 'flex'
  },
  button: {
    margin: theme.spacing()
  },
  wrapper: {
    margin: theme.spacing(),
    position: 'relative'
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
});

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
  confirmEmail: string,
  // gender: string,
  password: string,
  grade: string | number
  // birthdate: ?Object,
  // birthdateError: boolean
};

class AccountForm extends React.PureComponent<Props, State> {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    // gender: '',
    password: '',
    grade: ''
    // birthdate: null,
    // birthdateError: false
  };

  componentDidMount = () => {
    const { email: propsEmail } = this.props;
    this.setState({ email: propsEmail });
    ValidatorForm.addValidationRule('isEmailMatch', value => {
      const { email } = this.state;
      if (value !== email) {
        return false;
      }
      return true;
    });
    ValidatorForm.addValidationRule('isEmailRestricted', value => {
      const { emailDomain, emailRestriction } = this.props;
      if (emailRestriction) {
        let match = false;
        for (const domain of emailDomain) {
          if (value.endsWith(`.${domain}`) || value.endsWith(`@${domain}`))
            match = true;
        }
        return match;
      }
      return true;
    });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  // handleDateChange = selectedDate => {
  //   this.setState({ birthdate: selectedDate, birthdateError: false });
  // };

  handleSubmit = () => {
    const { onSubmit } = this.props;
    const {
      firstName,
      lastName,
      email,
      confirmEmail,
      // gender,
      password,
      grade
      // birthdate
    } = this.state;
    // if (!birthdate) {
    //   this.setState({ birthdateError: true });
    //   return;
    // }
    const data = {
      action: 'Account',
      data: {
        firstName,
        lastName,
        email,
        confirmEmail,
        // gender,
        password,
        grade
        // birthdate: birthdate && birthdate.format('YYYY-MM-DD')
      }
    };
    onSubmit(data);
  };

  render() {
    const { classes, type, hide, loading, emailDomain } = this.props;
    const {
      firstName,
      lastName,
      email,
      confirmEmail,
      // gender,
      password,
      grade
      // birthdate,
      // birthdateError
    } = this.state;
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
          label="Confirm Email Address"
          margin="normal"
          onChange={this.handleChange('confirmEmail')}
          name="confirmEmail"
          autoComplete="confirmEmail"
          fullWidth
          value={confirmEmail}
          disabled={loading}
          validators={['required', 'isEmailMatch']}
          errorMessages={[
            'Email Address is required',
            "Email Address don't match"
          ]}
        />
        {/* <FormControl variant="outlined" fullWidth>
          <SelectValidator
            value={gender}
            name="gender"
            label="Gender"
            disabled={loading}
            onChange={this.handleChange('gender')}
            variant="outlined"
            validators={['required']}
            errorMessages={['Gender is required']}
          >
            <MenuItem value="" />
            <MenuItem value="M">Male</MenuItem>
            <MenuItem value="F">Female</MenuItem>
            <MenuItem value="U">Unspecified</MenuItem>
          </SelectValidator>
        </FormControl> */}
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
        {/* <TextValidator
          variant="outlined"
          label="Birth Date"
          type="date"
          margin="normal"
          onChange={this.handleChange('birthdate')}
          name="birthdate"
          InputLabelProps={{
            shrink: true
          }}
          fullWidth
          value={birthdate}
          disabled={loading}
          validators={['required']}
          errorMessages={['Birth Date is required']}
        /> */}
        {/* <DatePicker
          value={birthdate}
          fullWidth
          onChange={this.handleDateChange}
          variant="outlined"
          label="Birth Date"
          margin="normal"
          name="birthdate"
          disableFuture
          openTo="year"
          format="MM/DD/YYYY"
          views={['year', 'month', 'day']}
          disabled={loading}
          className={classes.picker}
          error={birthdateError}
        />
        {birthdateError && (
          <FormHelperText error>Birth Date is required</FormHelperText>
        )} */}
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
            {(grades[type] || []).map(item => (
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
