import React, { useCallback, useContext } from 'react';

import Box from '@material-ui/core/Box';

import CollapseNavbar from 'components/CollapseNavbar/CollapseNavbar';
import CanvasChatContext from 'contexts/CanvasChatContext';
import { useCommunityChannels } from 'features/chat/hooks/useCommunities';

const CommunityChannelList: React.FC = () => {
  const { community, selectChannel } = useContext(CanvasChatContext);

  const communityData = community?.community;
  const channels = useCommunityChannels(community?.community.id);

  const handleCommunityChatClick = useCallback(
    (communityId, chatId) => {
      selectChannel(chatId);
    },
    [selectChannel]
  );

  if (!community || !communityData) {
    return null;
  }

  return (
    <Box>
      <CollapseNavbar channels={channels} onCommunityChatClick={handleCommunityChatClick} />
    </Box>
  );
};

export default CommunityChannelList;
