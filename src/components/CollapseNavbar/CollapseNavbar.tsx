import React, { useCallback, useState } from 'react';

import cx from 'classnames';

import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import { useStyles } from './CollapseNavbarStyles';
import CommunityChatSubListItem from './CommunityChatSubListItem';

import type { CommunityChannelData, CommunityChannelsData } from 'reducers/chat';

type Props = {
  channels?: CommunityChannelsData[];
  selectedChannel?: CommunityChannelData;
};

const CollapseNavbar = ({ channels, selectedChannel }: Props) => {
  const classes = useStyles();

  const [collapsedStates, setCollapsedStates] = useState({});

  const handleSwitchCollapsedState = useCallback(
    (channel) => {
      // We decide `undefined` means collapsed.
      setCollapsedStates({
        ...collapsedStates,
        [channel.id]: collapsedStates[channel.id] === false
      });
    },
    [collapsedStates]
  );

  const handleSubList = useCallback(
    (channel: CommunityChannelsData) => () => {
      handleSwitchCollapsedState(channel);
    },
    [handleSwitchCollapsedState]
  );

  const getCollapsedState = (channel) => collapsedStates[channel.id] !== false;

  // TODO Split into separate components
  const renderChannels = (channels: CommunityChannelsData[] = []) => {
    const content: React.ReactElement[] = [];
    channels.forEach((channel) => {
      content.push(
        <ListItem
          key={`${channel.id}-${channel.name}`}
          className={cx(
            classes.navLink,
            !channel?.channels && classes.childChannel
            // !channel?.channels && !channelMetadata?.[channel.chat_id] && classes.hide
          )}
          classes={{
            selected: classes.selected,
            button: classes.listItem
          }}
          onClick={handleSubList(channel)}
          button
        >
          <ListItemIcon
            classes={{
              root: classes.channelIcon
            }}
          >
            {!getCollapsedState(channel) ? <ExpandLess /> : <ExpandMore />}
          </ListItemIcon>
          <ListItemText
            classes={{
              primary: classes.channelName
            }}
            primary={channel.name}
          />
        </ListItem>,
        channel?.channels && renderSubList(channel.channels, channel)
      );
    });
    return content;
  };

  const renderSubList = (
    childChannels: CommunityChannelData[],
    parentChannel: CommunityChannelsData
  ) => (
    <Collapse
      in={getCollapsedState(parentChannel)}
      timeout="auto"
      unmountOnExit
      key={parentChannel.id}
    >
      <List component="div">
        {childChannels.map((channel) => (
          <CommunityChatSubListItem
            key={channel.chat_id}
            channelData={channel}
            selectedChannelId={selectedChannel?.chat_id}
          />
        ))}
      </List>
    </Collapse>
  );

  return <List component="nav">{renderChannels(channels)}</List>;
};

export default CollapseNavbar;
