import React from 'react';
import { useSelector } from 'react-redux';
import CommunityPicker from '../communityPicker/CommunityPicker';
import { useStyles } from './HudChatStyles';
import ChatChannel from './ChatChannel';
import ChatMember from './ChatMember';
import { CommunityData, HudChatState } from '../chatState/hudChatState';

const ChatChannels = () => {
  const classes: any = useStyles();

  const selectedCommunityId: string = useSelector(
    (state: { hudChat: HudChatState }) => state.hudChat.selectedCommunityId
  );

  const community: CommunityData = useSelector(
    (state: { hudChat: HudChatState }) => state.hudChat.idToCommunity[selectedCommunityId]
  );

  return (
    (community || null) && (
      <div className={classes.chatChannelsPane}>
        <div className={classes.channelAndMemberList}>
          {community.channelIdsInDisplayOrder.map((channelId: string) => (
            <ChatChannel key={channelId} channelId={channelId} />
          ))}

          <hr />

          {community.memberIdsInDisplayOrder.map((memberId: string) => (
            <ChatMember key={memberId} memberId={memberId} />
          ))}
        </div>

        <div className={classes.communityPicker}>
          <CommunityPicker />
        </div>
      </div>
    )
  );
};

export default ChatChannels;
