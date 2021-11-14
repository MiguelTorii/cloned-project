import React from 'react';
import { useSelector } from 'react-redux';
import RightMenu from '../../containers/CommunityChat/RightMenu';
import type { UserState } from '../../reducers/user';
import { ChatState } from '../../reducers/chat';
import { User } from '../../types/models';
import { useStyles } from './HudChatStyles';

const HudChat = () => {
  const classes: any = useStyles();

  const user: User = useSelector((state: { user: UserState }) => state.user.data);
  const chat: ChatState = useSelector((state: { chat: ChatState }) => state.chat);

  // TODO load chat data first

  return (
    <div className={classes.container}>
      <RightMenu
        isCommunityChat
        userId={user.userId}
        schoolId={user.schoolId}
        channel={chat.data.currentCommunityChannel}
        local={chat.data.local}
      />
    </div>
  );
};

export default HudChat;
