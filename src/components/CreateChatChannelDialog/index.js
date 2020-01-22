// @flow

import React from 'react';
import cx from 'classnames';
import {
  ValidatorForm,
  TextValidator,
  SelectValidator
} from 'react-material-ui-form-validator';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import Avatar from '@material-ui/core/Avatar';
import Collapse from '@material-ui/core/Collapse';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import GroupIcon from '@material-ui/icons/Group';
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
    marginTop: theme.spacing(2)
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
    marginTop: theme.spacing(2)
  },
  input: {
    display: 'none'
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
  chatType: string,
  thumbnail: ?string,
  isLoading: boolean,
  isVideo: boolean,
  onClose: Function,
  onSubmit: Function,
  onLoadOptions: Function,
  onSendInput: Function
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

class CreateChatChannelDialog extends React.PureComponent<Props, State> {
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
    const {
      classes,
      chatType: open,
      thumbnail,
      isLoading,
      isVideo
    } = this.props;
    const { chatType, name, type, inputValue, from, users, error } = this.state;

    return (
      <Dialog
        disableBackdropClick={isLoading}
        disableEscapeKeyDown={isLoading}
        style={{ maxWidth: 600, margin: '0 auto' }}
        fullScreen
        open={Boolean(open)}
        onClose={this.handleClose}
        fullWidth
        scroll="body"
        aria-labelledby="create-chat-dialog-title"
      >
        <DialogTitle
          id="create-chat-dialog-title"
          disableTypography
          className={classes.title}
        >
          <Typography variant="h6" className={classes.grow}>
            {`Create ${chatType === 'single' ? '1-to-1' : 'Group'} ${
              isVideo ? 'Video Room' : 'Chat'
            }`}
          </Typography>
          <Button
            disabled={isLoading}
            color="primary"
            variant="contained"
            onClick={this.handleChatTypeChange}
          >{`Create ${chatType === 'single' ? 'group' : '1-to-1'} ${
            isVideo ? 'video room' : 'chat'
          } instead`}</Button>
        </DialogTitle>
        <ValidatorForm
          onSubmit={this.handleSubmit}
          className={classes.validatorForm}
        >
          <DialogContent>
            <div className={classes.form}>
              <Collapse in={chatType === 'group'}>
                <Grid container>
                  <Grid item xs={6} className={classes.center}>
                    <ButtonBase
                      className={classes.avatarButton}
                      disabled={isLoading}
                      onClick={this.handleOpenInputFile}
                    >
                      <Avatar className={classes.avatar} src={thumbnail || ''}>
                        <GroupIcon className={classes.groupIcon} />
                      </Avatar>
                    </ButtonBase>
                    <input
                      accept="image/*"
                      className={classes.input}
                      ref={fileInput => {
                        this.fileInput = fileInput;
                      }}
                      onChange={this.handleInputChange}
                      type="file"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextValidator
                      label="Group Name"
                      margin="normal"
                      variant="outlined"
                      onChange={this.handleChange('name')}
                      name="name"
                      autoComplete="name"
                      fullWidth
                      value={name}
                      disabled={isLoading}
                    />
                    <FormControl variant="outlined" fullWidth>
                      <SelectValidator
                        value={type}
                        name="type"
                        label="Group Type"
                        onChange={this.handleChange('type')}
                        variant="outlined"
                        validators={chatType === 'group' ? ['required'] : []}
                        errorMessages={['You have to select a Group Type']}
                        disabled={isLoading}
                      >
                        <MenuItem value="" />
                        <MenuItem value="Class">Class</MenuItem>
                        <MenuItem value="Study">Study</MenuItem>
                        <MenuItem value="Social">Social</MenuItem>
                        <MenuItem value="Club">Activity/Club</MenuItem>
                      </SelectValidator>
                    </FormControl>
                  </Grid>
                </Grid>
              </Collapse>
              <div className={cx(chatType === 'group' && classes.marginTop)}>
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
                  errorText={
                    chatType === 'single'
                      ? 'You have to select 1 classmate'
                      : 'You must select at least 1 classmate'
                  }
                  cacheUniq={from}
                  isMulti
                  isDisabled={isLoading}
                  onChange={this.handleAutoComplete}
                  onLoadOptions={this.handleLoadOptions}
                />
              </div>
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

export default withStyles(styles)(CreateChatChannelDialog);
