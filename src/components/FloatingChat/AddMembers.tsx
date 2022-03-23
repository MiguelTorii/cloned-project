import React from 'react';

import { ValidatorForm } from 'react-material-ui-form-validator';

import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import withStyles from '@material-ui/core/styles/withStyles';

import { styles } from '../_styles/FloatingChat/AddMembers';
import AutoComplete from '../AutoComplete/AutoComplete';
import Dialog from '../Dialog/Dialog';

type Props = {
  classes: Record<string, any>;
  open: boolean;
  isLoading: boolean;
  onClose: (...args: Array<any>) => any;
  onSubmit: (...args: Array<any>) => any;
  onLoadOptions: (...args: Array<any>) => any;
};

type State = {
  from: string;
  users: Array<Record<string, any>>;
  error: boolean;
  inputValue: string;
};

class AddMembers extends React.PureComponent<Props, State> {
  state = {
    from: 'school',
    users: [],
    error: false,
    inputValue: ''
  };

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value
    } as any);
  };

  handleAutoComplete = (values) => {
    this.setState({
      users: values
    });

    if (values.length === 0) {
      this.setState({
        error: true
      });
    } else {
      this.setState({
        error: false
      });
    }
  };

  handleLoadOptions = (query) => {
    const { onLoadOptions } = this.props;
    const { from } = this.state;
    return onLoadOptions({
      query,
      from
    });
  };

  handleSubmit = () => {
    const { onSubmit } = this.props;
    const { users } = this.state;

    if (users.length === 0) {
      this.setState({
        error: true
      });
    } else {
      this.setState({
        error: false
      });
      onSubmit({
        selectedUsers: users
      });
      this.setState({
        users: [],
        inputValue: '',
        from: 'school'
      });
    }
  };

  handleClose = () => {
    const { onClose } = this.props;
    this.setState({
      users: [],
      inputValue: '',
      from: 'school'
    });
    onClose();
  };

  render() {
    const { classes, open, isLoading } = this.props;
    const { inputValue, from, users, error } = this.state;
    return (
      <Dialog
        className={classes.dialog}
        disableEscapeKeyDown={isLoading}
        okTitle="Add"
        open={open}
        onCancel={this.handleClose}
        onOk={this.handleSubmit}
        showActions
        showCancel
        title="Add New Group Member"
      >
        {isLoading && (
          <CircularProgress
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%'
            }}
          />
        )}
        <ValidatorForm onSubmit={this.handleSubmit} className={classes.validatorForm}>
          <div className={classes.form}>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="From"
                name="from"
                value={from}
                onChange={this.handleChange('from')}
                row
              >
                <FormControlLabel
                  value="school"
                  disabled={isLoading}
                  control={<Radio />}
                  label="My Classes"
                />
                <FormControlLabel
                  value="everyone"
                  disabled={isLoading}
                  control={<Radio />}
                  label="My School"
                />
              </RadioGroup>
            </FormControl>
            <AutoComplete
              values={users}
              inputValue={inputValue}
              label="Select users"
              placeholder="Search for classmates"
              error={error}
              errorText="You must select at least 1 classmate"
              cacheUniq={from}
              isMulti
              isDisabled={isLoading}
              onChange={this.handleAutoComplete}
              onLoadOptions={this.handleLoadOptions}
            />
          </div>
        </ValidatorForm>
      </Dialog>
    );
  }
}

export default withStyles(styles as any)(AddMembers);
