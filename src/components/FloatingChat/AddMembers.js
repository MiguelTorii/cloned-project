// @flow

import React from 'react';
import { ValidatorForm } from 'react-material-ui-form-validator';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import AutoComplete from '../AutoComplete';

const styles = theme => ({
  title: {
    display: 'flex',
    alignItems: 'center'
  },
  grow: {
    flex: 1
  },
  validatorForm: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit * 2
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarButton: {
    height: 120,
    width: 120,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatar: {
    height: 120,
    width: 120
  },
  groupIcon: {
    height: 80,
    width: 80
  },
  marginTop: {
    marginTop: theme.spacing.unit * 2
  },
  input: {
    display: 'none'
  },
  wrapper: {
    margin: theme.spacing.unit,
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
  open: boolean,
  isLoading: boolean,
  onClose: Function,
  onSubmit: Function,
  onLoadOptions: Function
};

type State = {
  chatType: string,
  name: string,
  type: string,
  from: string,
  users: Array<Object>,
  error: boolean,
  inputValue: string
};

class AddMembers extends React.PureComponent<Props, State> {
  state = {
    chatType: 'single',
    name: '',
    type: '',
    from: 'school',
    users: [],
    error: false,
    inputValue: ''
  };

  componentDidUpdate = prevProps => {
    const { chatType } = this.props;
    if (chatType && prevProps.chatType !== chatType) {
      this.setState({ chatType });
    }
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleAutoComplete = values => {
    const { chatType } = this.state;
    if (chatType === 'single' && values.length > 1)
      this.setState({ users: [values[values.length - 1]] });
    else this.setState({ users: values });
    if (values.length === 0) this.setState({ error: true });
    else this.setState({ error: false });
  };

  handleLoadOptions = query => {
    const { onLoadOptions } = this.props;
    const { from } = this.state;
    return onLoadOptions({ query, from });
  };

  handleChatTypeChange = () => {
    this.setState(({ chatType }) => ({
      chatType: chatType === 'single' ? 'group' : 'single'
    }));
  };

  handleSubmit = () => {
    const { onSubmit } = this.props;
    const { chatType, name, type, users } = this.state;
    if (users.length === 0) this.setState({ error: true });
    else if (chatType === 'single' && users.length > 1)
      this.setState({ error: true });
    else {
      this.setState({ error: false });
      onSubmit({ chatType, name, type, selectedUsers: users });
      this.setState({
        name: '',
        type: '',
        users: [],
        inputValue: '',
        from: 'school'
      });
    }
  };

  handleOpenInputFile = () => {
    if (this.fileInput) this.fileInput.click();
  };

  handleInputChange = () => {
    const { onSendInput } = this.props;
    if (
      this.fileInput &&
      this.fileInput.files &&
      this.fileInput.files.length > 0
    )
      onSendInput(this.fileInput.files[0]);
  };

  handleClose = () => {
    const { onClose } = this.props;
    this.setState({
      name: '',
      type: '',
      users: [],
      inputValue: '',
      from: 'school'
    });
    onClose();
  };

  // eslint-disable-next-line no-undef
  fileInput: ?HTMLInputElement;

  render() {
    const { classes, open, isLoading } = this.props;
    const { inputValue, from, users, error } = this.state;

    return (
      <Dialog
        disableBackdropClick={isLoading}
        disableEscapeKeyDown={isLoading}
        // style={{ maxWidth: 600, margin: '0 auto' }}
        // fullScreen
        fullWidth
        open={open}
        onClose={this.handleClose}
        scroll="body"
        aria-labelledby="add-members-dialog-title"
      >
        <DialogTitle
          id="add-members-dialog-title"
          disableTypography
          className={classes.title}
        >
          <Typography variant="h6">Add New Group Member</Typography>
        </DialogTitle>
        <ValidatorForm
          onSubmit={this.handleSubmit}
          className={classes.validatorForm}
        >
          <DialogContent>
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
                    label="My School"
                  />
                  <FormControlLabel
                    value="everyone"
                    disabled={isLoading}
                    control={<Radio />}
                    label="Everyone"
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
          </DialogContent>
          <DialogActions>
            <Button
              disabled={isLoading}
              onClick={this.handleClose}
              color="secondary"
              variant="contained"
            >
              Cancel
            </Button>

            <div className={classes.wrapper}>
              <Button
                disabled={isLoading}
                type="submit"
                color="primary"
                variant="contained"
              >
                Create
              </Button>
              {isLoading && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </div>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    );
  }
}

export default withStyles(styles)(AddMembers);
