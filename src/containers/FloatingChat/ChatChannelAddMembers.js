// @flow

import React from 'react';
import { connect } from 'react-redux';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { getInitials } from 'utils/chat';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import AddMembers from '../../components/FloatingChat/AddMembers';
import { searchUsers } from '../../api/user';
import { addGroupMembers } from '../../api/chat';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

type Props = {
  user: UserState,
  chatId: string,
  open: boolean,
  onClose: Function
};

type State = {
  isLoading: boolean
};

class ChatChannelAddMembers extends React.PureComponent<Props, State> {
  state = {
    isLoading: false
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

  handleSubmit = async ({ selectedUsers }) => {
    this.setState({ isLoading: true });
    const { chatId } = this.props;
    try {
      await addGroupMembers({
        chatId,
        users: selectedUsers.map((user) => Number(user.userId))
      });
    } finally {
      this.handleClose();
    }
  };

  handleClose = () => {
    const { onClose } = this.props;
    this.setState({ isLoading: false });
    onClose();
  };

  render() {
    const { open } = this.props;
    const { isLoading } = this.state;
    return (
      <ErrorBoundary>
        <AddMembers
          isLoading={isLoading}
          open={open}
          onClose={this.handleClose}
          onSubmit={this.handleSubmit}
          onLoadOptions={this.handleLoadOptions}
        />
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect(mapStateToProps, null)(withMobileDialog()(ChatChannelAddMembers));
