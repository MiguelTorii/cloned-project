// @flow

import React from 'react';
import axios from 'axios';
import some from 'lodash/some';
import { connect } from 'react-redux';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import CreateChatChannelDialog from '../../components/CreateChatChannelDialog';
import { searchUsers, getBlockedUsers } from '../../api/chat';
import { getPresignedURL } from '../../api/media';

type Props = {
  user: UserState,
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

  handleSubmit = async ({ chatType, name, type, selectedUsers }) => {
    const {
      client,
      channels,
      user: {
        data: { userId, firstName, lastName }
      },
      onChannelCreated,
      onClose
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
        onChannelCreated({ channel: channelFound, isNew: false });
        onClose();
      } else {
        const blockedBy = await getBlockedUsers({ userId });

        const result = userList.filter(
          user => !some(blockedBy, { user_id: user.userId })
        );
        if (result.length !== userList.length) {
          onClose();
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

        onChannelCreated({ channel, isNew: true });
        onClose();
      }
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { type, onClose } = this.props;
    const { thumbnail, isLoading } = this.state;
    return (
      <CreateChatChannelDialog
        chatType={type}
        thumbnail={thumbnail}
        isLoading={isLoading}
        onClose={onClose}
        onSubmit={this.handleSubmit}
        onLoadOptions={this.handleLoadOptions}
        onSendInput={this.handleUploadThumbnail}
      />
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect(
  mapStateToProps,
  null
)(withMobileDialog()(CreateChatChannel));
