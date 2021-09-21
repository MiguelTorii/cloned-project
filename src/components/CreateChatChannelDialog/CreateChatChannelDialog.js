// @flow

import React, { useState, useEffect } from 'react';
import { ValidatorForm } from 'react-material-ui-form-validator';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '../Dialog/Dialog';
import AutoComplete from '../AutoComplete/AutoComplete';
import styles from '../_styles/CreateChatChannelDialog';

type Props = {
  classes: Object,
  isLoading: boolean,
  onClose: Function,
  onSubmit: Function,
  onLoadOptions: Function,
  members: Array,
  title: ?string
};

const CreateChatChannelDialog = ({
  classes,
  isLoading,
  title,
  onClose,
  onSubmit,
  okLabel,
  members,
  chatType: chatTypeProp,
  onLoadOptions
}: Props) => {
  const [chatType, setChatType] = useState(chatTypeProp);
  const [name, setName] = useState('');
  const [type, setType] = useState('Class');
  const [from, setFrom] = useState('school');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (users.length > 1 && chatType === 'single') setChatType('group');
    else if (users.length <= 1 && chatType === 'group') setChatType('single');
  }, [users, chatType]);

  useEffect(() => {
    setChatType(chatTypeProp);
  }, [chatTypeProp]);

  const handleAutoComplete = (values) => {
    setUsers(values);
    setError(false);
  };

  const handleLoadOptions = async (query) => {
    const users = await onLoadOptions({ query, from });
    const currentGroupMemberIds = members.map((member) =>
      Number(member.userId)
    );
    const ordered = users.options
      .filter((option) => !currentGroupMemberIds.includes(option.userId))
      .sort((a, b) => {
        if (a.relationship && !b.relationship) return -1;
        if (!a.relationship && b.relationship) return 1;
        return 0;
      });
    return { options: ordered, hasMore: false };
  };

  const handleSubmit = () => {
    if (users.length === 0) setError(true);
    else {
      setError(false);
      onSubmit({ chatType, name, type, selectedUsers: users });
      setName('');
      setType('');
      setUsers([]);
      setInputValue('');
      setFrom('school');
    }
  };

  const handleClose = () => {
    setName('');
    setType('');
    setUsers([]);
    setFrom('school');
    onClose();
  };

  return (
    <Dialog
      className={classes.dialog}
      disableActions={isLoading}
      disableEscapeKeyDown={isLoading}
      open={Boolean(chatType)}
      onCancel={handleClose}
      onOk={handleSubmit}
      okTitle={okLabel || 'Create'}
      showHeader={false}
      contentClassName={classes.contentClassName}
      okButtonClass={classes.okButtonClass}
      showActions
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
      <div className={classes.header}>
        <Typography className={classes.label} variant="h6">
          {title || 'Setup a Class Group Chat or Send a Direct Message'}
        </Typography>
        <CloseIcon className={classes.closeIcon} onClick={handleClose} />
      </div>
      <Typography variant="subtitle1">
        Add up to one or more classmates to chat.
      </Typography>
      <ValidatorForm className={classes.validatorForm} onSubmit={handleSubmit}>
        <div className={classes.form}>
          <div>
            <AutoComplete
              classes={{ root: classes.searchMember }}
              values={users}
              relative
              inputValue={inputValue}
              searchClassmate
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
};

export default withStyles(styles)(CreateChatChannelDialog);
