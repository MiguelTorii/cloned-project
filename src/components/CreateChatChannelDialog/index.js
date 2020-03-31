// @flow

import React, { useRef, useState, useEffect } from 'react';
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
import CircularProgress from '@material-ui/core/CircularProgress';
import GroupIcon from '@material-ui/icons/Group';
import AutoComplete from '../AutoComplete';

const styles = theme => ({
  dialogTitleRoot: {
    paddingBottom: 0
  },
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
    height: '60vh',
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
  thumbnail: ?string,
  isLoading: boolean,
  isVideo: boolean,
  onClose: Function,
  onSubmit: Function,
  onLoadOptions: Function,
  onSendInput: Function
};

const CreateChatChannelDialog = ({
  classes,
  thumbnail,
  isLoading,
  isVideo,
  onClose,
  onSubmit,
  chatType: chatTypeProp,
  onLoadOptions,
  onSendInput
}: Props) => {
  const [chatType, setChatType] = useState(chatTypeProp)
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [from, setFrom] = useState('school')
  const [users, setUsers] = useState([])
  const [error, setError] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const fileInput = useRef(null)

  useEffect(() => {
    if (users.length > 1 && chatType === 'single') setChatType('group')
    else if (users.length <= 1 && chatType === 'group') setChatType('single')
    // eslint-disable-next-line
  }, [users])

  useEffect(() => {
    setChatType(chatTypeProp)
  }, [chatTypeProp])

  const handleAutoComplete = values => {
    setUsers(values);
    setError(false);
  };

  const handleLoadOptions = query => {
    return onLoadOptions({ query, from });
  };

  const handleSubmit = () => {
    if (users.length === 0) setError(true)
    else {
      setError(false)
      onSubmit({ chatType, name, type, selectedUsers: users });
      setName('')
      setType('')
      setUsers([])
      setInputValue('')
      setFrom('school')
    }
  };

  const handleOpenInputFile = () => {
    if (fileInput.current) fileInput.current.click();
  };

  const handleInputChange = () => {
    if (
      fileInput.current &&
      fileInput.current.files &&
      fileInput.current.files.length > 0
    )
      onSendInput(fileInput.current.files[0]);
  };

  const handleClose = () => {
    setName('')
    setType('')
    setUsers([])
    setFrom('school')
    onClose();
  };

  return (
    <Dialog
      disableBackdropClick={isLoading}
      disableEscapeKeyDown={isLoading}
      style={{ maxWidth: 600, margin: '0 auto' }}
      open={Boolean(chatType)}
      onClose={handleClose}
      fullWidth
      scroll="body"
      aria-labelledby="create-chat-dialog-title"
    >
      <DialogTitle
        id="create-chat-dialog-title"
        disableTypography
        classes={{
          root: classes.dialogTitleRoot
        }}
        className={classes.title}
      >
        <Typography variant="h6" className={classes.grow}>
          {`Create ${
              isVideo ? 'Video Room' : 'Chat'
            }`}
        </Typography>
      </DialogTitle>
      <ValidatorForm
        onSubmit={handleSubmit}
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
                    onClick={handleOpenInputFile}
                  >
                    <Avatar className={classes.avatar} src={thumbnail || ''}>
                      <GroupIcon className={classes.groupIcon} />
                    </Avatar>
                  </ButtonBase>
                  <input
                    accept="image/*"
                    className={classes.input}
                    ref={fileInput}
                    onChange={handleInputChange}
                    type="file"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextValidator
                    label="Group Name"
                    margin="normal"
                    variant="outlined"
                    onChange={e => setName(e.target.value)}
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
                      onChange={e => setType(e.target.value)}
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
            <div>
              <AutoComplete
                values={users}
                inputValue={inputValue}
                label="Select users"
                placeholder="Search for classmates"
                error={error}
                errorText="You must select at least 1 classmate"
                cacheUniq={from}
                autoFocus
                isMulti
                isDisabled={isLoading}
                onChange={handleAutoComplete}
                onLoadOptions={handleLoadOptions}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={isLoading}
            onClick={handleClose}
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

export default withStyles(styles)(CreateChatChannelDialog);

