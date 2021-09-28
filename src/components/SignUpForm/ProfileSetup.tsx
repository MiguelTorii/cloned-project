import React from 'react';
import cx from 'classnames';
import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import { states } from '../../constants/clients';
import { styles } from '../_styles/SignUpForm/ProfileSetup';

type Props = {
  classes?: Record<string, any>;
  type?: string;
  loading?: boolean;
  hide?: boolean;
  onBack?: (...args: Array<any>) => any;
  onSubmit?: (...args: Array<any>) => any;
};

type State = {
  state: string;
  grade: string | number;
  school: any;
  studentId: string;
  parentFirstName: string;
  parentLastName: string;
  parentEmail: string;
  parentPhone: string;
  error: boolean;
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

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value
    } as any);
  };

  handleSubmit = () => {
    const { onSubmit } = this.props;
    const data = {
      action: 'ProfileSetup',
      data: { ...this.state }
    };
    onSubmit(data);
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
        <FormControl variant="outlined" fullWidth className={classes.formControl}>
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
            {(states[type] || []).map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </SelectValidator>
        </FormControl>
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
          <Button type="submit" fullWidth variant="contained" color="primary" disabled={loading}>
            Submit
          </Button>
          {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
        </div>
      </ValidatorForm>
    );
  }
}

export default withStyles(styles as any)(ProfileSetup);
