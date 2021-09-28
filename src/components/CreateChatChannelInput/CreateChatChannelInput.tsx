import React, { useCallback, useState, useEffect } from 'react';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { bindActionCreators } from 'redux';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded';
import CircularProgress from '@material-ui/core/CircularProgress';
import BatchMessage from '../../containers/Chat/BatchMessage';
import SelectClassmates from '../CreateCommunityChatChannelInput/SelectClassmates';
import * as chatActions from '../../actions/chat';
import { sendMessage, createChannel } from '../../api/chat';
import { searchUsers } from '../../api/user';
import type { UserState } from '../../reducers/user';
import type { ChatState } from '../../reducers/chat';
import { getInitials } from '../../utils/chat';
import AutoComplete from '../AutoComplete/AutoComplete';
import { styles } from '../_styles/CreateChatChannelInput';
import type { State as StoreState } from '../../types/state';

type Props = {
  classes?: Record<string, any>;
  user?: UserState;
  onOpenChannel?: (...args: Array<any>) => any;
  createMessage?: Record<string, any>;
  handleClearCreateMessage?: (...args: Array<any>) => any;
  chat?: ChatState;
  isFloatChat?: boolean;
  closeNewChannel?: any;
};

const CreateChatChannelInput = ({
  classes,
  user,
  createMessage,
  onOpenChannel,
  handleClearCreateMessage,
  closeNewChannel,
  chat,
  isFloatChat = false
}: Props) => {
  const [chatType, setChatType] = useState('single');
  const [name, setName] = useState('');
  const [type, setType] = useState('Class');
  const [from, setFrom] = useState('school');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const {
    data: { userId, schoolId }
  } = user;
  const {
    data: { client }
  } = chat;
  useEffect(() => {
    if (users.length > 1 && chatType === 'single') {
      setChatType('group');
    } else if (users.length <= 1 && chatType === 'group') {
      setChatType('single');
    }
  }, [users, chatType]);
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
            const channel = await client.getChannelBySid(chatId);

            if (createMessage) {
              await sendMessage({
                message: createMessage.message,
                ...createMessage.messageAttributes,
                chatId: channel.sid
              });
            }

            onOpenChannel({
              channel
            });
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
    [users, chatType, client, name, onOpenChannel, type, createMessage]
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
    }
  }, [chatType, name, type, users, onSubmit]);
  useEffect(() => {
    const createChannel = async () => {
      await handleSubmit();
      handleClearCreateMessage();
    };

    if (createMessage && !isLoading) {
      createChannel();
    }
  }, [createMessage, handleClearCreateMessage, handleSubmit, isLoading]);
  return (
    <ValidatorForm className={classes.validatorForm} onSubmit={handleSubmit}>
      <div className={classes.form}>
        {isFloatChat ? (
          <div className={classes.inputContainer}>
            <SelectClassmates
              isFloatChat
              values={users}
              relative
              inputValue={inputValue}
              placeholder="Type a name or multiple names"
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
        ) : (
          <>
            <div className={classes.inputContainer}>
              <AutoComplete
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
            <IconButton
              className={classes.button}
              onClick={handleSubmit}
              disabled={isLoading}
              color="primary"
            >
              {isLoading ? <CircularProgress /> : <CheckCircleOutlineRoundedIcon />}
            </IconButton>
          </>
        )}
        <BatchMessage closeNewChannel={closeNewChannel} user={user} chat={chat} />
      </div>
    </ValidatorForm>
  );
};

const mapStateToProps = ({ user, chat }: StoreState): {} => ({
  user,
  chat
});

const mapDispatchToProps = (dispatch: any): {} =>
  bindActionCreators(
    {
      closeNewChannel: chatActions.closeNewChannel
    },
    dispatch
  );

export default connect<{}, {}, Props>(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles as any)(CreateChatChannelInput));
