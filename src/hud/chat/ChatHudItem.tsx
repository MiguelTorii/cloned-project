import React from 'react';
import { useSelector } from 'react-redux';
import withWidth from '@material-ui/core/withWidth';
import withRoot from '../../withRoot';
import RightMenu from '../../containers/CommunityChat/RightMenu';
import type { UserState } from '../../reducers/user';
import { ChatState } from '../../reducers/chat';
import { User } from '../../types/models';

const ChatHudItem = () => {
  const user: User = useSelector((state: { user: UserState }) => state.user.data);
  const chat: ChatState = useSelector((state: { chat: ChatState }) => state.chat);

  // TODO load chat data first

  return (
    <RightMenu
      isCommunityChat
      userId={user.userId}
      schoolId={user.schoolId}
      channel={chat.data.currentCommunityChannel}
      local={chat.data.local}
    />
  );
};

export default withRoot(withWidth()(ChatHudItem));
