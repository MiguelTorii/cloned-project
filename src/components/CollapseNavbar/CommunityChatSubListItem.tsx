import React, { memo } from 'react';

import cx from 'clsx';
import { push } from 'connected-react-router';

import Badge from '@material-ui/core/Badge';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { generateChatPath } from 'utils/chat';

import { messageLoadingAction } from 'actions/chat';
import { ReactComponent as ChannelIcon } from 'assets/svg/public-channel.svg';
import { ReactComponent as UnreadMessageChannelIcon } from 'assets/svg/unread-message-channel-icon.svg';
import { useChannelMessagesPrefetch, useUnreadById } from 'features/chat';
import { useAppDispatch } from 'redux/store';

import { useStyles } from './CollapseNavbarStyles';

import type { CommunityChannelData } from 'reducers/chat';

const CommunityChatSubListItem = memo(
  ({
    channelData,
    selectedChannelId,
    onClick
  }: {
    channelData: CommunityChannelData;
    selectedChannelId?: string;
    onClick?: (communityId: number, chatId: string) => void;
  }) => {
    const dispatch = useAppDispatch();
    const classes = useStyles();
    const { data: unread } = useUnreadById(channelData.chat_id);
    const debouncedPrefetch = useChannelMessagesPrefetch(channelData.chat_id);

    const onMouseEnter = () => {
      debouncedPrefetch();
    };

    const onMouseLeave = () => {
      debouncedPrefetch.cancel();
    };

    const handleClick = () => {
      if (selectedChannelId !== channelData.chat_id) {
        if (onClick) {
          onClick(channelData.community_id, channelData.chat_id);
        } else {
          dispatch(push(generateChatPath(channelData.community_id, channelData.chat_id)));
          dispatch(messageLoadingAction(true));
        }
      }
    };

    return (
      <ListItem
        key={channelData.chat_name}
        className={cx(classes.navLink, classes.childChannel)}
        selected={selectedChannelId === channelData.chat_id}
        classes={{
          selected: classes.selected,
          button: classes.listItem
        }}
        button
        onClick={handleClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <ListItemIcon
          classes={{
            root: classes.channelIcon
          }}
        >
          {unread ? <UnreadMessageChannelIcon /> : <ChannelIcon />}
        </ListItemIcon>
        <div className={classes.list}>
          <ListItemText
            classes={{
              primary: cx(classes.channelName, unread && classes.unreadMessageChannel)
            }}
            primary={channelData.chat_name}
          />
          {!!unread && unread > 0 && (
            <Badge
              badgeContent={unread}
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
  }
);

export default CommunityChatSubListItem;
