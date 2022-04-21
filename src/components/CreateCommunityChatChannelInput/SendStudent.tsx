import React, { useCallback, useState, useEffect, useMemo } from 'react';

import { ValidatorForm } from 'react-material-ui-form-validator';
import { useSelector } from 'react-redux';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { PERMISSIONS } from 'constants/common';
import { getInitials } from 'utils/chat';

import { sendMessage, createChannel } from 'api/chat';
import { searchUsers } from 'api/user';

import styles from '../_styles/CreateCommunityChatChannelInput/sendStudent';

import SelectClassmates from './SelectClassmates';

import type { ChatState } from 'reducers/chat';
import type { UserState } from 'reducers/user';

type Props = {
  classes?: Record<string, any>;
  user?: UserState;
  onOpenChannel?: (id: string) => void;
  setIsOpen?: (...args: Array<any>) => any;
  createMessage?: Record<string, any>;
  handleClearCreateMessage?: (...args: Array<any>) => any;
  chat?: ChatState;
  permission?: Array<any>;
  handleUpdateGroupName?: (...args: Array<any>) => any;
  onClosePopover?: (...args: Array<any>) => any;
};

const CreateChatChannelInput = ({
  classes,
  createMessage,
  setIsOpen,
  onOpenChannel,
  handleClearCreateMessage,
  permission,
  handleUpdateGroupName,
  onClosePopover
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
  const {
    data: { userId, schoolId }
  } = useSelector((state: { user: UserState }) => state.user);
  const {
    data: { client }
  } = useSelector((state: { chat: ChatState }) => state.chat);
  // ONE_TOUCH_SEND_CHAT
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
          userId: user.userId,
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

      try {
        const userIds = users.map((item) => Number(item.userId));
        const { chatId } = await createChannel({
          users: userIds,
          groupName: chatType === 'group' ? name : '',
          type: chatType === 'group' ? type : '',
          thumbnailUrl: ''
        });

        if (chatId !== '') {
          try {
            const channel = await client.getConversationBySid(chatId);

            if (channelName.length && isShow) {
              const res = await channel.updateFriendlyName(channelName);
              await handleUpdateGroupName(res);
            }

            if (createMessage) {
              await sendMessage({
                message: createMessage.message,
                ...createMessage.messageAttributes,
                chatId: channel.sid
              });
            }

            onOpenChannel?.(channel.sid);
          } catch (e) {
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [
      users,
      chatType,
      client,
      name,
      onOpenChannel,
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

        <Box display="flex" alignItems="center" justifyContent="flex-end" width={1}>
          <Button className={classes.cancelBtn} color="primary" onClick={onClosePopover}>
            Cancel
          </Button>
          <Button
            className={classes.createDM}
            variant="contained"
            onClick={handleSubmit}
            color="primary"
          >
            Create New Message
          </Button>
        </Box>
      </div>
    </ValidatorForm>
  );
};

export default withStyles(styles as any)(CreateChatChannelInput);
