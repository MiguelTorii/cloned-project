// @flow

import React, { Fragment } from 'react';
import cx from 'classnames';
import {
  ValidatorForm,
  TextValidator,
  SelectValidator
} from 'react-material-ui-form-validator';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import green from '@material-ui/core/colors/green';
import AutoComplete from '../AutoComplete';
import type { SelectType } from '../../types/models';
import { states, grades } from '../../constants/clients';

const styles = theme => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  hide: {
    display: 'none'
  },
  formControl: {
    marginBottom: theme.spacing.unit * 2
  },
  title: {
    margin: theme.spacing.unit * 2
  },
  actions: {
    display: 'flex'
  },
  button: {
    margin: theme.spacing.unit
  },
  wrapper: {
    margin: theme.spacing.unit,
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
  onLoadOptions: Function,
  onBack: Function,
  onSubmit: Function
};

type State = {
  state: string,
  grade: string | number,
  school: ?SelectType,
  studentId: string,
  parentFirstName: string,
  parentLastName: string,
  parentEmail: string,
  parentPhone: string,
  error: boolean
};

class ProfileSetup extends React.PureComponent<Props, State> {
  state = {
    state: '',
    grade: '',
    school: null,
    studentId: '',
    parentFirstName: '',
    parentLastName: '',
    parentEmail: '',
    parentPhone: '',
    error: false
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleAutoComplete = value => {
    this.setState({ school: value });
    if (!value) this.setState({ error: true });
    else this.setState({ error: false });
  };

  handleLoadOptions = () => {
    const { state } = this.state;
    const { type, onLoadOptions } = this.props;
    return onLoadOptions({ type, stateId: state });
  };

  handleSubmit = () => {
    const { onSubmit } = this.props;
    const { school, error, ...newState } = this.state;
    if (school) {
      const data = {
        action: 'ProfileSetup',
        data: {
          school: Number(school.value),
          ...newState
        }
      };
      onSubmit(data);
    } else {
      this.setState({ error: true });
    }
  };

  render() {
    const { classes, type, hide, loading, onBack } = this.props;
    const {
      state,
      grade,
      school,
      studentId,
      parentFirstName,
      parentLastName,
      parentEmail,
      parentPhone,
      error
    } = this.state;

    return (
      <ValidatorForm
        onSubmit={this.handleSubmit}
        className={cx(classes.form, hide && classes.hide)}
      >
        <FormControl
          variant="outlined"
          fullWidth
          className={classes.formControl}
        >
          <SelectValidator
            value={state}
            name="state"
            label="State"
            onChange={this.handleChange('state')}
            variant="outlined"
            validators={['required']}
            errorMessages={['State is required']}
          >
            <MenuItem value="" />
            {(states[type] || []).map(item => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </SelectValidator>
        </FormControl>
        <FormControl
          variant="outlined"
          fullWidth
          className={classes.formControl}
        >
          <SelectValidator
            value={grade}
            name="grade"
            label="Grade"
            onChange={this.handleChange('grade')}
            variant="outlined"
            validators={['required']}
            errorMessages={['Grade is required']}
          >
            <MenuItem value="" />
            {(grades[type] || []).map(item => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </SelectValidator>
        </FormControl>
        <AutoComplete
          style={{ zIndex: 9999 }}
          values={school}
          isDisabled={state === ''}
          inputValue=""
          label={`${type === 'K-12' ? 'School' : 'College'}`}
          placeholder={`Search for your ${
            type === 'K-12' ? 'School' : 'College'
          }`}
          error={error}
          errorText={`You must select a ${
            type === 'K-12' ? 'School' : 'College'
          }`}
          onChange={this.handleAutoComplete}
          onLoadOptions={this.handleLoadOptions}
        />
        <TextValidator
          variant="outlined"
          label="Student ID"
          margin="normal"
          onChange={this.handleChange('studentId')}
          name="studentId"
          autoComplete="studentId"
          fullWidth
          value={studentId}
          disabled={loading}
        />
        {type === 'K-12' && grade !== '' && Number(grade) <= 8 && (
          <Fragment>
            <Typography variant="subtitle1" className={classes.title}>
              Parent Info
            </Typography>
            <Divider light />
            <TextValidator
              variant="outlined"
              label="First Name"
              margin="normal"
              onChange={this.handleChange('parentFirstName')}
              name="parentFirstName"
              fullWidth
              value={parentFirstName}
              disabled={loading}
              validators={['required']}
              errorMessages={['First Name is required']}
            />
            <TextValidator
              variant="outlined"
              label="Last Name"
              margin="normal"
              onChange={this.handleChange('parentLastName')}
              name="parentLastName"
              fullWidth
              value={parentLastName}
              disabled={loading}
              validators={['required']}
              errorMessages={['Last Name is required']}
            />
            <TextValidator
              variant="outlined"
              label="Email Address"
              margin="normal"
              onChange={this.handleChange('parentEmail')}
              name="parentEmail"
              fullWidth
              value={parentEmail}
              disabled={loading}
              validators={['required', 'isEmail']}
              errorMessages={[
                'Email Address is required',
                'email is not valid'
              ]}
            />
            <TextValidator
              variant="outlined"
              label="Phone Number"
              margin="normal"
              onChange={this.handleChange('parentPhone')}
              name="parentPhone"
              type="phone"
              fullWidth
              value={parentPhone}
              disabled={loading}
              validators={['required']}
              errorMessages={['Phone Number is required']}
            />
          </Fragment>
        )}
        <div className={classes.actions}>
          <Button
            variant="contained"
            color="default"
            disabled={loading}
            className={classes.button}
            onClick={onBack}
          >
            Back
          </Button>
        </div>
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

export default withStyles(styles)(ProfileSetup);
