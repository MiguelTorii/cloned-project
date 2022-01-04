import React from 'react';
import cx from 'classnames';
import { Action, Dispatch } from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import { Badge, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { ReactComponent as ChannelIcon } from '../../assets/svg/public-channel.svg';
import { ReactComponent as UnreadMessageChannelIcon } from '../../assets/svg/unread-message-channel-icon.svg';
import { useStyles } from './HudChatStyles';
import { ChannelData, HudChatState } from '../chatState/hudChatState';
import { selectChannelId } from '../chatState/hudChatActions';

type Props = {
  channelId: string;
};

const ChatChannel = ({ channelId }: Props) => {
  const classes: any = useStyles();

  const dispatch: Dispatch<Action> = useDispatch();

  const channel: ChannelData = useSelector(
    (state: { hudChat: HudChatState }) => state.hudChat.idToChannel[channelId]
  );

  const selectedChannelId = useSelector(
    (state: { hudChat: HudChatState }) => state.hudChat.selectedChannelId
  );

  const setChannelId = () => {
    dispatch(selectChannelId(channelId));
  };

  if (!channel) {
    return null;
  }

  return (
    <ListItem
      key={channel.id}
      className={cx(classes.navLink)}
      selected={selectedChannelId === channel.id}
      classes={{
        selected: classes.selected,
        button: classes.listItem
      }}
      onClick={setChannelId}
      button
    >
      {/* Channel hash icon */}
      <ListItemIcon
        classes={{
          root: classes.channelIcon
        }}
      >
        {channel.unreadCount ? <UnreadMessageChannelIcon /> : <ChannelIcon />}
      </ListItemIcon>

      {/* Channel name */}
      <ListItemText
        classes={{
          primary: cx(classes.channelName, channel.unreadCount && classes.unreadMessageChannel)
        }}
        primary={channel.displayName}
      />

      {/* Channel unread badge */}
      {channel.unreadCount > -1 && (
        <Badge
          badgeContent={channel.unreadCount}
          color="secondary"
          classes={{
            badge: classes.badge
          }}
        />
      )}
    </ListItem>
  );
};

export default ChatChannel;
