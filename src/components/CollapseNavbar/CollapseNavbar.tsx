/* eslint-disable no-nested-ternary */

/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Tooltip from '../../containers/Tooltip/Tooltip';
import { ReactComponent as ChannelIcon } from '../../assets/svg/public-channel.svg';
import { ReactComponent as UnreadMessageChannelIcon } from '../../assets/svg/unread-message-channel-icon.svg';

const useStyles = makeStyles((theme) => ({
  navLink: {
    maxHeight: 32
  },
  unreadMessageChannel: {
    color: 'white',
    fontWeight: 700,
    paddingRight: theme.spacing(1 / 2)
  },
  childChannel: {
    paddingLeft: theme.spacing(5)
  },
  selected: {
    backgroundColor: `${theme.circleIn.palette.modalBackground} !important`
  },
  channelName: {
    fontSize: 14,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },
  channelIcon: {
    minWidth: 16
  },
  selectedChannel: {
    color: 'white'
  },
  hide: {
    display: 'none'
  },
  list: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    overflowX: 'hidden'
  },
  listItem: {
    '&:hover': {
      backgroundColor: `${theme.circleIn.palette.hoverColor} !important`
    }
  },
  badge: {
    transform: 'none',
    position: 'static'
  }
}));

type Props = {
  channels?: Array<any>;
  selectedChannel?: any;
  local?: Array<any>;
  currentCommunityChannel?: Record<string, any>;
  startMessageLoading?: (...args: Array<any>) => any;
  setSelctedChannel?: (...args: Array<any>) => any;
  setCurrentChannelSidAction?: (...args: Array<any>) => any;
  setCurrentCommunityChannel?: (...args: Array<any>) => any;
};

const CollapseNavbar = ({
  channels,
  selectedChannel,
  startMessageLoading,
  local,
  currentCommunityChannel,
  setSelctedChannel,
  setCurrentChannelSidAction,
  setCurrentCommunityChannel
}: Props) => {
  const classes: any = useStyles();
  const [collapsedStates, setCollapsedStates] = useState({});

  const handleSwitchCollapsedState = (channel) => {
    // We decide `undefined` means collapsed.
    setCollapsedStates({
      ...collapsedStates,
      [channel.id]: collapsedStates[channel.id] === false
    });
  };

  const getCollapsedState = (channel) => collapsedStates[channel.id] !== false;

  const handleSubList = (parent, channel) => () => {
    // If current channel has children, switch the collapsed state.
    if (channel.channels) {
      handleSwitchCollapsedState(channel);
    }

    if (!channel?.channels && currentCommunityChannel.sid !== channel.chat_id) {
      setCurrentChannelSidAction(channel.chat_id);
      setCurrentCommunityChannel(local[channel.chat_id].twilioChannel);
      setSelctedChannel(channel);
      startMessageLoading(true);
    }
  };

  const renderChannels = (channels) => {
    const content = [];
    channels.forEach((channel) => {
      content.push(
        <ListItem
          key={channel?.channels ? `${channel.id}-${channel.name}` : channel.chat_name}
          className={cx(
            classes.navLink,
            !channel?.channels && classes.childChannel,
            !channel?.channels && !local[channel.chat_id] && classes.hide
          )}
          selected={selectedChannel && selectedChannel.chat_id === channel.chat_id}
          classes={{
            selected: classes.selected,
            button: classes.listItem
          }}
          onClick={handleSubList(channel?.channels ? channel.name : channel.chat_name, channel)}
          button
        >
          {channel?.channels ? (
            <ListItemIcon
              classes={{
                root: classes.channelIcon
              }}
            >
              {!getCollapsedState(channel) ? <ExpandLess /> : <ExpandMore />}
            </ListItemIcon>
          ) : local[channel.chat_id] ? (
            <ListItemIcon
              classes={{
                root: classes.channelIcon
              }}
            >
              {local[channel.chat_id]?.unread ? <UnreadMessageChannelIcon /> : <ChannelIcon />}
            </ListItemIcon>
          ) : null}
          {channel?.channels ? (
            <ListItemText
              classes={{
                primary: classes.channelName
              }}
              primary={channel.name}
            />
          ) : local[channel.chat_id] ? (
            <div className={classes.list}>
              <ListItemText
                classes={{
                  primary: cx(
                    classes.channelName,
                    local[channel.chat_id]?.unread && classes.unreadMessageChannel
                  )
                }}
                primary={local[channel.chat_id] && channel.chat_name}
              />
              {local[channel.chat_id]?.unread > 0 && (
                <Badge
                  badgeContent={local[channel.chat_id]?.unread}
                  color="secondary"
                  classes={{
                    badge: classes.badge
                  }}
                >
                  <span />
                </Badge>
              )}
            </div>
          ) : null}
        </ListItem>,
        channel?.channels && renderSubList(channel.channels, channel)
      );
    });
    return content;
  };

  const renderSubList = (childChannels, parentChannel) => (
    <Collapse
      in={getCollapsedState(parentChannel)}
      timeout="auto"
      unmountOnExit
      key={parentChannel.id}
    >
      <List component="div">{renderChannels(childChannels)}</List>
    </Collapse>
  );

  return <List component="nav">{renderChannels(channels)}</List>;
};

export default CollapseNavbar;
