import React, { useContext } from 'react';

import List from '@material-ui/core/List';

import ChannelItem from 'containers/canvas/ChannelItem';
import CanvasChatContext from 'contexts/CanvasChatContext';
import { useOrderedChannelList } from 'features/chat';

import useStyles from './ChannelListStyles';

const ChannelList = () => {
  const classes = useStyles();
  const { selectChannel } = useContext(CanvasChatContext);
  const channelList = useOrderedChannelList();

  return (
    <List className={classes.root}>
      {channelList.map((sid) => (
        <ChannelItem key={sid} sid={sid} onClick={() => selectChannel(sid)} />
      ))}
    </List>
  );
};

export default ChannelList;
