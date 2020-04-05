// @flow

import React, { useState, useEffect } from 'react';
import {
  ValidatorForm,
} from 'react-material-ui-form-validator';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
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
    flex: 1,
    paddingBottom: theme.spacing()
  },
  validatorForm: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
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
  },
  dialogContent: {
    '&:first-child': {
      paddingTop: 0
    }
  }
});

type Props = {
  classes: Object,
  isLoading: boolean,
  isVideo: boolean,
  onClose: Function,
  onSubmit: Function,
  onLoadOptions: Function
};

const CreateChatChannelDialog = ({
  classes,
  isLoading,
  isVideo,
  onClose,
  onSubmit,
  chatType: chatTypeProp,
  onLoadOptions,
}: Props) => {
  const [chatType, setChatType] = useState(chatTypeProp)
  const [name, setName] = useState('')
  const [type, setType] = useState('Class')
  const [from, setFrom] = useState('school')
  const [users, setUsers] = useState([])
  const [error, setError] = useState(false)
  const [inputValue, setInputValue] = useState('')

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
      open={Boolean(chatType)}
      onClose={handleClose}
      fullWidth
      maxWidth='sm'
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
        <Typography variant="h6" className={classes.grow} id="circlein-chat-title">
          Setup a Class Group Chat or Send a Direct Message
        </Typography>
      </DialogTitle>
      <ValidatorForm
        onSubmit={handleSubmit}
        className={classes.validatorForm}
      >
        <DialogContent
          classes={{
            root: classes.dialogContent
          }}
        >
          <div className={classes.form}>
            <div>
              <AutoComplete
                values={users}
                relative
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

