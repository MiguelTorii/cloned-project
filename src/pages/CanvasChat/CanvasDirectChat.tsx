import React, { useContext } from 'react';

import ChannelList from 'containers/canvas/ChannelList';
import Main from 'containers/CommunityChat/Main';
import CanvasChatContext from 'contexts/CanvasChatContext';
import { useOrderedChannelList } from 'features/chat';

import useStyles from './CanvasChatStyles';

const CanvasDirectChat = () => {
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
        <ChannelList />
      )}
    </div>
  );
};

export default CanvasDirectChat;
