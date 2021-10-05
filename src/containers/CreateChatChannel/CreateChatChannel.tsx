import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { getInitials } from '../../utils/chat';
import type { UserState } from '../../reducers/user';
import type { ChatState } from '../../reducers/chat';
import type { State as StoreState } from '../../types/state';
import CreateChatChannelDialog from '../../components/CreateChatChannelDialog/CreateChatChannelDialog';
import { searchUsers } from '../../api/user';
import { getPresignedURL } from '../../api/media';
import { createChannel } from '../../api/chat';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

type Props = {
  user?: UserState;
  chat?: ChatState;
  type?: string | null | undefined;
  client?: Record<string, any>;
  isVideo?: boolean;
  onClose?: (...args: Array<any>) => any;
  onChannelCreated?: (...args: Array<any>) => any;
  title?: string | null | undefined;
  channels?: any;
};

type State = {
  thumbnail: string | null | undefined;
  isLoading: boolean;
};

class CreateChatChannel extends React.PureComponent<Props, State> {
  static defaultProps = {
    isVideo: false
  };

  state = {
    thumbnail: null,
    isLoading: false
  };

  componentDidUpdate = (prevProps) => {
    const {
      chat: {
        data: { entityId, entityFirstName, entityLastName, entityVideo, entityUuid }
      }
    } = this.props;
    const {
      chat: {
        data: { entityUuid: prevEntityUuid }
      }
    } = prevProps;

    if (entityId !== 0 && entityUuid !== prevEntityUuid) {
      this.handleSubmit({
        chatType: 'single',
        name: '',
        type: '',
        selectedUsers: [
          {
            userId: entityId,
            firstName: entityFirstName,
            lastName: entityLastName
          }
        ],
        startVideo: entityVideo
      });
    }
  };

  handleLoadOptions = async ({ query, from }) => {
    if (query.trim() === '' || query.trim().length < 3) {
      return {
        options: [],
        hasMore: false
      };
    }

    const {
      user: {
        data: { userId, schoolId }
      }
    } = this.props;
    const users = await searchUsers({
      userId,
      query,
      schoolId: from === 'school' ? Number(schoolId) : undefined
    });
    const options = users.map((user) => {
      const name = `${user.firstName} ${user.lastName}`;
      const initials = getInitials(name);
      return {
        value: user.userId,
        label: name,
        school: user.school,
        grade: user.grade,
        avatar: user.profileImageUrl,
        initials,
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        relationship: user.relationship
      };
    });
    return {
      options,
      hasMore: false
    };
  };

  handleUploadThumbnail = async (file) => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;
    const result = await getPresignedURL({
      userId,
      type: 4,
      mediaType: file.type
    });
    const { readUrl, url } = result;
    await axios.put(url, file, {
      headers: {
        'Content-Type': file.type
      }
    });
    this.setState({
      thumbnail: readUrl
    });
  };

  handleSubmit = async ({ chatType, name, type, selectedUsers, startVideo = false }) => {
    const { client, onChannelCreated } = this.props;
    const { thumbnail } = this.state;
    this.setState({
      isLoading: true
    });

    try {
      const users = selectedUsers.map((item) => Number(item.userId));
      const { chatId, isNewChat } = await createChannel({
        users,
        groupName: chatType === 'group' ? name : '',
        type: chatType === 'group' ? type : '',
        thumbnailUrl: chatType === 'group' ? thumbnail : ''
      });

      if (chatId !== '') {
        try {
          const channel = await client.getChannelBySid(chatId);
          onChannelCreated({
            channel,
            isNew: isNewChat,
            startVideo
          });
          this.handleClose();
        } catch (e) {
          this.setState({
            isLoading: false
          });
        }
      } else {
        this.setState({
          isLoading: false
        });
      }
    } finally {
      this.setState({
        isLoading: false
      });
    }
  };

  handleClose = () => {
    const { onClose } = this.props;
    this.setState({
      thumbnail: null,
      isLoading: false
    });
    onClose();
  };

  render() {
    const { isVideo, type, title } = this.props;
    const { thumbnail, isLoading } = this.state;
    return (
      <ErrorBoundary>
        <CreateChatChannelDialog
          chatType={type}
          thumbnail={thumbnail}
          isLoading={isLoading}
          isVideo={isVideo}
          onClose={this.handleClose}
          onSubmit={this.handleSubmit}
          onLoadOptions={this.handleLoadOptions}
          onSendInput={this.handleUploadThumbnail}
          title={title}
        />
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = ({ user, chat }: StoreState): {} => ({
  user,
  chat
});

export default connect<{}, {}, Props>(mapStateToProps, null)(withMobileDialog()(CreateChatChannel));
