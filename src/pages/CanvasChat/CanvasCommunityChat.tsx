import React, { useContext } from 'react';

import CommunityChannelList from 'containers/canvas/CommunityChannelList';
import Main from 'containers/CommunityChat/Main';
import CanvasChatContext from 'contexts/CanvasChatContext';
import { useOrderedChannelList } from 'features/chat';

import useStyles from './CanvasChatStyles';

const CanvasCommunityChat = () => {
  const classes = useStyles();
  const { channel } = useContext(CanvasChatContext);
  const channelListLength = useOrderedChannelList().length;

  return (
    <div className={classes.innerMain}>
      {channel ? (
        <div className={classes.conversationWrapper}>
          <Main channelLength={channelListLength} channel={channel} rightSpace={0} reduced />
        </div>
      ) : (
        <CommunityChannelList />
      )}
    </div>
  );
};

export default CanvasCommunityChat;
