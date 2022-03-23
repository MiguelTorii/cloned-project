import React, { useCallback, useState, useEffect, useMemo } from 'react';

import { ValidatorForm } from 'react-material-ui-form-validator';
import { useSelector } from 'react-redux';

import { CircularProgress } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';

import { PERMISSIONS } from 'constants/common';
import { getInitials } from 'utils/chat';

import { handleNewChannel, messageLoadingAction } from 'actions/chat';
import { sendMessage, createChannel } from 'api/chat';
import { searchUsers } from 'api/user';
import { useChatClient } from 'features/chat';
import { useAppDispatch } from 'redux/store';

import SelectClassmates from './SelectClassmates';

import type { UserState } from 'reducers/user';

const styles = (theme) => ({
  validatorForm: {
    flex: 1,
    padding: theme.spacing(3),
    minWidth: 350,
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  typography: {
    fontSize: 20,
    color: 'white'
  },
  shortDescription: {
    fontSize: 16,
    margin: theme.spacing(1, 0, 2, 0)
  },
  form: {
    width: '100%',
    // Fix IE 11 issue.
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column'
  },
  inputContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.circleIn.palette.feedBackground,
    borderRadius: theme.spacing(),
    boxSizing: 'border-box',
    boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)',
    marginBottom: theme.spacing()
  },
  createDM: {
    marginTop: theme.spacing(),
    width: '100%',
    fontWeight: 'bold',
    color: 'white',
    background: 'linear-gradient(115.22deg, #94DAF9 -9.12%, #1E88E5 90.34%)',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
    borderRadius: 20
  },
  groupName: {
    marginTop: theme.spacing(),
    backgroundColor: theme.circleIn.palette.feedBackground,
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.circleIn.palette.gray3
    },
    '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.circleIn.palette.gray3
    }
  },
  helperText: {
    color: theme.circleIn.palette.darkTextColor,
    backgroundColor: theme.circleIn.palette.appBar,
    fontSize: 12,
    lineHeight: '16px',
    textAlign: 'right',
    margin: 0
  },
  input: {
    display: 'none'
  },
  labelText: {
    color: `${theme.circleIn.palette.secondaryText} !important`,
    fontSize: 16
  },
  notchedOutline: {
    borderColor: 'white'
  },
  name: {
    color: theme.circleIn.palette.darkTextColor,
    fontSize: 14,
    lineHeight: '19px'
  }
});

type Props = {
  classes?: Record<string, any>;
  onClosePopover?: (...args: Array<any>) => any;
  setIsOpen?: (...args: Array<any>) => any;
  createMessage?: Record<string, any>;
  handleClearCreateMessage?: (...args: Array<any>) => any;
  permission?: Array<any>;
  handleUpdateGroupName?: (...args: Array<any>) => any;
};

const CreateChatChannelInput = ({
  classes,
  onClosePopover,
  createMessage,
  setIsOpen,
  handleClearCreateMessage,
  permission,
  handleUpdateGroupName
}: Props) => {
  const [chatType, setChatType] = useState('single');
  const [name, setName] = useState('');
  const [type, setType] = useState('Class');
  const [from, setFrom] = useState('school');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [channelName, setChannelName] = useState('');
  const dispatch = useAppDispatch();

  const {
    data: { userId, schoolId }
  } = useSelector((state: { user: UserState }) => state.user);

  const client = useChatClient();

  useEffect(() => {
    if (users.length > 1 && chatType === 'single') {
      setChatType('group');
    } else if (users.length <= 1 && chatType === 'group') {
      setChatType('single');
    }
  }, [users, chatType]);
  const isShow = useMemo(
    () => permission && permission.includes(PERMISSIONS.RENAME_GROUP_CHAT_ACCESS),
    [permission]
  );
  const handleAutoComplete = useCallback((values) => {
    setUsers(values);
    setError(false);
  }, []);
  const handleLoadOptions = useCallback(
    async (query) => {
      if (query.trim() === '' || query.trim().length < 3) {
        return {
          options: [],
          hasMore: false
        };
      }

      const users = await searchUsers({
        userId,
        query,
        schoolId: from === 'school' ? Number(schoolId) : undefined
      });
      const options = users.map((user) => {
        const name = `${user.firstName} ${user.lastName}`;
        const initials = getInitials(name);
        return {
          ...user,
          value: user.userId,
          label: name,
          userId: String(user.userId),
          avatar: user.profileImageUrl,
          role: user?.role,
          initials
        };
      });
      const ordered = options.sort((a: any, b: any) => {
        if (a.relationship && !b.relationship) {
          return -1;
        }

        if (!a.relationship && b.relationship) {
          return 1;
        }

        return 0;
      });
      return {
        options: ordered,
        hasMore: false
      };
    },
    [from, schoolId, userId]
  );
  const onSubmit = useCallback(
    async (params: any) => {
      setIsLoading(true);
      dispatch(messageLoadingAction(true));
      try {
        const userIds = users.map((item) => Number(item.userId));
        const { chatId } = await createChannel({
          users: userIds,
          groupName: chatType === 'group' ? name : '',
          type: chatType === 'group' ? type : '',
          thumbnailUrl: ''
        });

        if (!chatId) {
          throw new Error('No chat ID returned.');
        }

        const channel = await client?.getChannelBySid(chatId);

        if (!channel) {
          throw new Error('No channel returned.');
        }

        if (channelName.length && isShow) {
          const res = await channel?.updateFriendlyName(channelName);
          await handleUpdateGroupName?.(res);
        }

        if (createMessage) {
          await sendMessage({
            message: createMessage.message,
            ...createMessage.messageAttributes,
            chatId: channel.sid
          });
        }
      } catch (e) {
        console.log(e);
        dispatch(messageLoadingAction(false));
      } finally {
        dispatch(handleNewChannel(false));
        setIsLoading(false);
        // Handling of global chat loading tate in useChatSubscription
      }
    },
    [
      dispatch,
      users,
      chatType,
      client,
      name,
      type,
      channelName,
      createMessage,
      isShow,
      handleUpdateGroupName
    ]
  );
  const handleSubmit = useCallback(async () => {
    if (users.length === 0) {
      setError(true);
    } else {
      setError(false);
      await onSubmit({
        chatType,
        name,
        type,
        selectedUsers: users
      });
      setName('');
      setType('');
      setUsers([]);
      setInputValue('');
      setFrom('school');
      setIsOpen(false);
    }
  }, [users, onSubmit, chatType, name, type, setIsOpen]);
  useEffect(() => {
    const createChannel = async () => {
      await handleSubmit();
      handleClearCreateMessage();
    };

    if (createMessage && !isLoading) {
      createChannel();
    }
  }, [createMessage, handleClearCreateMessage, handleSubmit, isLoading]);
  const handleGroupNameChange = useCallback(
    (e) => {
      if (e.target.value.length > 100) {
        return;
      }

      setChannelName(e.target.value);
    },
    [setChannelName]
  );
  return (
    <ValidatorForm className={classes.validatorForm} onSubmit={handleSubmit}>
      <div className={classes.header}>
        <Typography className={classes.typography} variant="h6">
          SELECT CLASSMATES
        </Typography>
        <CloseIcon className={classes.closeIcon} onClick={onClosePopover} />
      </div>
      <Typography className={classes.shortDescription}>
        Invite one or more classmates to chat
      </Typography>
      <div className={classes.form}>
        <div className={classes.inputContainer}>
          <SelectClassmates
            values={users}
            relative
            inputValue={inputValue}
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
        {isShow && !!users.length && (
          <TextField
            placeholder="Give this group chat a name!"
            label="Group Chat Name (optional)"
            fullWidth
            variant="outlined"
            onChange={handleGroupNameChange}
            value={channelName}
            helperText={`${100 - (channelName?.length || 0)} characters remaining`}
            FormHelperTextProps={{
              className: classes.helperText
            }}
            InputLabelProps={{
              className: classes.labelText
            }}
            inputProps={{
              className: classes.name
            }}
            classes={{
              root: classes.groupName
            }}
            size="medium"
          />
        )}

        <Button
          className={classes.createDM}
          variant="contained"
          onClick={handleSubmit}
          color="primary"
          disabled={isLoading}
          startIcon={isLoading && <CircularProgress size={20} />}
        >
          Create New Message
        </Button>
      </div>
    </ValidatorForm>
  );
};

export default withStyles(styles as any)(CreateChatChannelInput);
