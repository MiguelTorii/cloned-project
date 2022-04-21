import React, { useState } from 'react';

import { useSelector } from 'react-redux';

import { Tab, Tabs, withStyles } from '@material-ui/core';
import IconChat from '@material-ui/icons/Chat';

import { ReactComponent as IconChatMembers } from 'assets/svg/chat-studyroom-members.svg';

import CommunityPicker from '../communityPicker/CommunityPicker';

import ChatChannel from './ChatChannel';
import ChatMember from './ChatMember';
import { useStyles } from './HudChatStyles';

import type { CommunityData, HudChatState } from '../chatState/hudChatState';

const StyledTabs = withStyles((theme) => ({
  flexContainer: {
    display: 'flex',
    justifyContent: 'stretch'
  },
  indicator: {
    height: '2px'
  }
}))((props: any) => (
  <Tabs
    {...props}
    TabIndicatorProps={{
      children: <span />
    }}
  />
));

const StyledTab = withStyles((theme) => ({
  root: {
    minWidth: '50%'
  }
}))((props: any) => <Tab {...props} />);

// TODO: Remove component, doesn't seem used
const ChatChannels = () => {
  const classes: any = useStyles();

  const [selectedTab, setSelectedTab] = useState<number>(0);

  const selectedCommunityId: string = useSelector(
    (state: { hudChat: HudChatState }) => state.hudChat.selectedCommunityId
  );

  const community: CommunityData = useSelector(
    (state: { hudChat: HudChatState }) => state.hudChat.idToCommunity[selectedCommunityId]
  );

  if (!community) {
    return null;
  }

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <div className={classes.chatChannelsPane}>
      {/* Class picker */}
      <div className={classes.communityPicker}>
        <CommunityPicker />
      </div>

      {/* Channels or members picker */}
      <div className={classes.filterTabs}>
        <StyledTabs
          value={selectedTab}
          onChange={handleChange}
          aria-label="pick channels or members"
        >
          <StyledTab icon={<IconChat />} aria-label="channels" />
          <StyledTab icon={<IconChatMembers />} aria-label="members" />
        </StyledTabs>
      </div>

      {/* Members picker */}
      {selectedTab === 0 &&
        community.channelIdsInDisplayOrder.map((channelId: string) => (
          <ChatChannel key={channelId} channelId={channelId} />
        ))}

      {/* Channels picker */}
      {selectedTab === 1 &&
        community.memberIdsInDisplayOrder.map((memberId: string) => (
          <ChatMember key={memberId} memberId={memberId} />
        ))}
    </div>
  );
};

export default ChatChannels;
