/* eslint-disable no-nested-ternary */
/* eslint-disable no-use-before-define */
// @flow
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
import Tooltip from 'containers/Tooltip/Tooltip';
import { ReactComponent as ChannelIcon } from 'assets/svg/public-channel.svg';
import { ReactComponent as UnreadMessageChannelIcon } from 'assets/svg/unread-message-channel-icon.svg';

const useStyles = makeStyles((theme) => ({
  navLink: {
    maxHeight: 32
  },
  unreadMessageChannel: {
    color: 'white',
    fontWeight: 700
  },
  childChannel: {
    paddingLeft: theme.spacing(5)
  },
  selected: {
    backgroundColor: `${theme.circleIn.palette.modalBackground} !important`
  },
  channelName: {
    fontSize: 14
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
    '&>:first-child': {
      width: '100%'
    }
  },
  listItem: {
    '&:hover': {
      backgroundColor: `${theme.circleIn.palette.hoverColor} !important`
    }
  },
  badge: {
    right: theme.spacing()
  }
}));

type Props = {
  channels: Array,
  selectedChannel: Array,
  local: Array,
  startMessageLoading: Function,
  setSelctedChannel: Function,
  setCurrentChannelSidAction: Function,
  setCurrentCommunityChannel: Function
};

const CollapseNavbar = ({
  channels,
  selectedChannel,
  startMessageLoading,
  local,
  setSelctedChannel,
  setCurrentChannelSidAction,
  setCurrentCommunityChannel
}: Props) => {
  const classes = useStyles();
  const [subListOpen, setSubListOpen] = useState('');

  useEffect(() => {
    setSubListOpen('');
  }, [channels]);

  const handleSubList = (parent, channel) => () => {
    if (subListOpen === parent) {
      setSubListOpen('');
    } else {
      setSubListOpen(parent);
    }

    if (!channel?.channels) {
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
          key={
            channel?.channels
              ? `${channel.id}-${channel.name}`
              : channel.chat_name
          }
          className={cx(
            classes.navLink,
            !channel?.channels && classes.childChannel,
            !channel?.channels && !local[channel.chat_id] && classes.hide
          )}
          selected={
            selectedChannel && selectedChannel.chat_id === channel.chat_id
          }
          classes={{
            selected: classes.selected,
            button: classes.listItem
          }}
          onClick={handleSubList(
            channel?.channels ? channel.name : channel.chat_name,
            channel
          )}
          button
        >
          {channel?.channels ? (
            <ListItemIcon classes={{ root: classes.channelIcon }}>
              {subListOpen === channel?.name ? <ExpandLess /> : <ExpandMore />}
            </ListItemIcon>
          ) : local[channel.chat_id] ? (
            <ListItemIcon classes={{ root: classes.channelIcon }}>
              {local[channel.chat_id]?.unread ? (
                <UnreadMessageChannelIcon />
              ) : (
                <ChannelIcon />
              )}
            </ListItemIcon>
          ) : null}
          {channel?.channels ? (
            <ListItemText
              classes={{ primary: classes.channelName }}
              primary={channel.name}
            />
          ) : local[channel.chat_id] ? (
            <div className={classes.list}>
              <Tooltip
                id={9089}
                hidden={channel.chat_name !== 'introduce-yourself'}
                placement="right"
                text="Let your classmates know you’re here, tell them where you’re from, and we made a space for everything you need to chat about. "
                okButton="Yay! 🎉"
              >
                <ListItemText
                  classes={{
                    primary: cx(
                      classes.channelName,
                      local[channel.chat_id]?.unread &&
                        classes.unreadMessageChannel
                    )
                  }}
                  primary={local[channel.chat_id] && channel.chat_name}
                />
              </Tooltip>
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
        channel?.channels && renderSubList(channel.channels, channel.name)
      );
    });

    return content;
  };

  const renderSubList = (childChannels, parentChannelName) => (
    <Collapse
      in={subListOpen !== parentChannelName}
      timeout="auto"
      unmountOnExit
      key={parentChannelName}
    >
      <List component="div">{renderChannels(childChannels)}</List>
    </Collapse>
  );

  return <List component="nav">{renderChannels(channels)}</List>;
};

export default CollapseNavbar;
