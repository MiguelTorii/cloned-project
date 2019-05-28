// @flow

import React from 'react';
import axios from 'axios';
import some from 'lodash/some';
import { connect } from 'react-redux';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import type { UserState } from '../../reducers/user';
import type { ChatState } from '../../reducers/chat';
import type { State as StoreState } from '../../types/state';
import CreateChatChannelDialog from '../../components/CreateChatChannelDialog';
import { getBlockedUsers, searchUsers } from '../../api/user';
import { getPresignedURL } from '../../api/media';
import ErrorBoundary from '../ErrorBoundary';

type Props = {
  user: UserState,
  chat: ChatState,
  type: ?string,
  client: Object,
  channels: Array<Object>,
  onClose: Function,
  onChannelCreated: Function
};

type State = {
  thumbnail: ?string,
  isLoading: boolean
};

class CreateChatChannel extends React.PureComponent<Props, State> {
  state = {
    thumbnail: null,
    isLoading: false
  };

  componentDidUpdate = prevProps => {
    const {
      chat: {
        data: {
          entityId,
          entityFirstName,
          entityLastName,
          entityVideo,
          entityUuid
        }
      }
    } = this.props;
    const {
      chat: {
        data: { entityUuid: prevEntityUuid }
      }
    } = prevProps;

    if (entityId !== '' && entityUuid !== prevEntityUuid) {
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
    if (query.trim() === '' || query.trim().length < 3)
      return {
        options: [],
        hasMore: false
      };
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

    const options = users.map(user => {
      const name = `${user.firstName} ${user.lastName}`;
      const initials =
        name !== '' ? (name.match(/\b(\w)/g) || []).join('') : '';
      return {
        value: user.userId,
        label: name,
        school: user.school,
        grade: user.grade,
        avatar: user.profileImageUrl,
        initials,
        userId: Number(user.userId),
        firstName: user.firstName,
        lastName: user.lastName
      };
    });
    return {
      options,
      hasMore: false
    };
  };

  handleUploadThumbnail = async file => {
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

    this.setState({ thumbnail: readUrl });
  };

  handleSubmit = async ({
    chatType,
    name,
    type,
    selectedUsers,
    startVideo = false
  }) => {
    const {
      client,
      channels,
      user: {
        data: { userId, firstName, lastName }
      },
      onChannelCreated
    } = this.props;
    const { thumbnail } = this.state;
    this.setState({ isLoading: true });
    try {
      const userList = selectedUsers.map(item => ({
        userId: Number(item.userId),
        firstName: item.firstName,
        lastName: item.lastName
      }));
      userList.push({ userId: Number(userId), firstName, lastName });
      let exist = false;
      let channelFound = {};
      // eslint-disable-next-line no-restricted-syntax
      for (const item of channels) {
        const { state = {} } = item;
        const { attributes = {} } = state;
        const { users = [] } = attributes;
        if (users.length === userList.length) {
          const count = users.reduce((prev, current) => {
            if (some(userList, { userId: Number(current.userId) }))
              return prev + 1;
            return prev;
          }, 0);
          if (count === userList.length) {
            channelFound = item;
            exist = true;
            break;
          }
        }
      }

      if (exist) {
        onChannelCreated({ channel: channelFound, isNew: false, startVideo });
        this.handleClose();
      } else {
        const blockedBy = await getBlockedUsers({ userId });

        const result = userList.filter(
          user => !some(blockedBy, { user_id: user.userId })
        );
        if (result.length !== userList.length) {
          this.handleClose();
          return;
        }
        const channel = await client.createChannel({
          friendlyName: name,
          isPrivate: true,
          attributes: {
            friendlyName: chatType === 'group' ? name : '',
            groupType: chatType === 'group' ? type : '',
            thumbnail: chatType === 'group' ? thumbnail : '',
            users: userList
          }
        });

        // eslint-disable-next-line no-restricted-syntax
        for (const user of userList) {
          // eslint-disable-next-line no-await-in-loop
          await channel.add(String(user.userId));
        }

        onChannelCreated({ channel, isNew: true, startVideo });
        this.handleClose();
      }
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleClose = () => {
    const { onClose } = this.props;
    this.setState({ thumbnail: null, isLoading: false });
    onClose();
  };

  render() {
    const { type } = this.props;
    const { thumbnail, isLoading } = this.state;
    return (
      <ErrorBoundary>
        <CreateChatChannelDialog
          chatType={type}
          thumbnail={thumbnail}
          isLoading={isLoading}
          onClose={this.handleClose}
          onSubmit={this.handleSubmit}
          onLoadOptions={this.handleLoadOptions}
          onSendInput={this.handleUploadThumbnail}
        />
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = ({ user, chat }: StoreState): {} => ({
  user,
  chat
});

export default connect(
  mapStateToProps,
  null
)(withMobileDialog()(CreateChatChannel));
