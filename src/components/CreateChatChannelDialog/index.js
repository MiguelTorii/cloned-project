// @flow

import React, { useState, useEffect } from 'react';
import {
  ValidatorForm,
} from 'react-material-ui-form-validator';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog, { dialogStyle } from '../Dialog';
import AutoComplete from '../AutoComplete';

const styles = () => ({
  validatorForm: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
  },
  input: {
    display: 'none'
  },
  dialog: {
    ...dialogStyle,
    width: 800
  }
});

type Props = {
  classes: Object,
  isLoading: boolean,
  onClose: Function,
  onSubmit: Function,
  onLoadOptions: Function,
  title: ?string
};

const CreateChatChannelDialog = ({
  classes,
  isLoading,
  title,
  onClose,
  onSubmit,
  okLabel,
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
  }, [users, chatType])

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
      className={classes.dialog}
      disableActions={isLoading}
      disableBackdropClick={isLoading}
      disableEscapeKeyDown={isLoading}
      open={Boolean(chatType)}
      onCancel={handleClose}
      onOk={handleSubmit}
      okTitle={okLabel || "Create"}
      showActions
      showCancel
      title={title || "Setup a Class Group Chat or Send a Direct Message"}
    >
      {isLoading && <CircularProgress
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%'
        }}
      />}
      <ValidatorForm
        className={classes.validatorForm}
        onSubmit={handleSubmit}
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
      </ValidatorForm>
    </Dialog>
  );
}

export default withStyles(styles)(CreateChatChannelDialog);

