import React, { useState } from 'react';
import cx from 'classnames';
import { push } from 'connected-react-router';

import Badge from '@material-ui/core/Badge';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import { generateChatPath } from 'utils/chat';

import { messageLoadingAction } from 'actions/chat';
import { ReactComponent as ChannelIcon } from 'assets/svg/public-channel.svg';
import { ReactComponent as UnreadMessageChannelIcon } from 'assets/svg/unread-message-channel-icon.svg';
import { useUnreadCount } from 'features/chat';
import { useAppDispatch } from 'redux/store';

import type { CommunityChannelData, CommunityChannelsData } from 'reducers/chat';
import type { Channel } from 'twilio-chat';

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
  channels?: CommunityChannelsData[];
  selectedChannel?: CommunityChannelData;
  currentCommunityChannel?: Channel;
};

const CollapseNavbar = ({ channels, selectedChannel, currentCommunityChannel }: Props) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const [collapsedStates, setCollapsedStates] = useState({});
  const { data: unread } = useUnreadCount();

  const handleSwitchCollapsedState = (channel) => {
    // We decide `undefined` means collapsed.
    setCollapsedStates({
      ...collapsedStates,
      [channel.id]: collapsedStates[channel.id] === false
    });
  };

  const getCollapsedState = (channel) => collapsedStates[channel.id] !== false;

  const handleSubList =
    (parent: string, channel: CommunityChannelData | CommunityChannelsData) => () => {
      // If current channel has children, switch the collapsed state.
      if ('channels' in channel) {
        handleSwitchCollapsedState(channel);
        return;
      }

      if (currentCommunityChannel?.sid !== channel.chat_id) {
        dispatch(push(generateChatPath(channel.community_id, channel.chat_id)));
        dispatch(messageLoadingAction(true));
      }
    };

  const renderSubChannels = (channels: CommunityChannelData[] = []) => {
    const content: React.ReactElement[] = [];
    channels.forEach((channel) => {
      content.push(
        <ListItem
          key={channel.chat_name}
          className={cx(classes.navLink, classes.childChannel)}
          selected={selectedChannel?.chat_id === channel.chat_id}
          classes={{
            selected: classes.selected,
            button: classes.listItem
          }}
          onClick={handleSubList(channel.chat_name, channel)}
          button
        >
          <ListItemIcon
            classes={{
              root: classes.channelIcon
            }}
          >
            {unread?.[channel.chat_id] ? <UnreadMessageChannelIcon /> : <ChannelIcon />}
          </ListItemIcon>
          <div className={classes.list}>
            <ListItemText
              classes={{
                primary: cx(
                  classes.channelName,
                  unread?.[channel.chat_id] && classes.unreadMessageChannel
                )
              }}
              primary={channel.chat_name}
            />
            {unread?.[channel.chat_id] > 0 && (
              <Badge
                badgeContent={unread?.[channel.chat_id]}
                color="secondary"
                classes={{
                  badge: classes.badge
                }}
              >
                <span />
              </Badge>
            )}
          </div>
        </ListItem>
      );
    });
    return content;
  };

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
          onClick={handleSubList(channel.name, channel)}
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
      <List component="div">{renderSubChannels(childChannels)}</List>
    </Collapse>
  );

  return <List component="nav">{renderChannels(channels)}</List>;
};

export default CollapseNavbar;
