import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from 'redux/store';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';

import LoadImg from '../LoadImg/LoadImg';
import { ReactComponent as Chat } from '../../assets/svg/community-chat.svg';
import StyledBadge from './StyledBadge';
import useStyles from './_styles/styles';
import { ChannelWrapper, CurrentCommunity } from '../../reducers/chat';

type Props = {
  item?: Record<string, any>;
  unreadMessageCount?: number;
  communityChannels?: any[];
  handleSelect?: (...args: Array<any>) => any;
};

const CommunityMenu = ({ item, unreadMessageCount, communityChannels, handleSelect }: Props) => {
  const classes: any = useStyles();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const local = useSelector<AppState, Record<string, ChannelWrapper>>(
    (state) => state.chat.data.local
  );
  const selectedCourse = useSelector<AppState, CurrentCommunity>(
    (state) => state.chat.data.currentCommunity
  );
  useEffect(() => {
    const { id } = item;

    if (id !== 'chat') {
      const currentCourseChannel = communityChannels.filter(
        (courseChannel) => courseChannel.courseId === id
      );

      if (currentCourseChannel.length) {
        const communityChannels = currentCourseChannel[0].channels;
        let count = 0;
        communityChannels.forEach((communityChannel) => {
          communityChannel.channels.forEach((channel) => {
            if (local[channel.chat_id]?.unread) {
              count += local[channel.chat_id].unread;
            }
          });
        });
        setUnreadMessages(count);
      }
    }
  }, [item, local, communityChannels]);
  const handleSelectItem = useCallback(() => {
    handleSelect(item);
  }, [handleSelect, item]);
  const isDirectChat = useMemo(() => ['chat'].indexOf(item.id) > -1, [item]);
  return (
    <Tooltip
      title={isDirectChat ? 'Direct Chat' : item.name}
      placement="top"
      arrow
      classes={{
        tooltip: classes.tooltip
      }}
    >
      {item.communityIconUrl ? (
        <ListItem
          button
          onClick={handleSelectItem}
          selected={selectedCourse && selectedCourse.id === item.id}
          classes={{
            root: classes.listItem,
            selected: classes.selectedItem
          }}
        >
          <StyledBadge max={99} badgeContent={unreadMessages} color="secondary">
            <ListItemIcon
              classes={{
                root: classes.itemContent
              }}
            >
              <LoadImg url={item.communityIconUrl} />
            </ListItemIcon>
          </StyledBadge>
        </ListItem>
      ) : (
        <ListItem
          button
          onClick={handleSelectItem}
          selected={selectedCourse && selectedCourse.id === item.id}
          classes={{
            root: classes.listItem,
            selected: classes.selectedItem
          }}
          style={{
            backgroundColor: item.color ? item.color : '#C45960'
          }}
        >
          {isDirectChat ? (
            <StyledBadge max={99} badgeContent={unreadMessageCount} color="secondary">
              <ListItemIcon
                classes={{
                  root: classes.itemContent
                }}
              >
                <Chat />
              </ListItemIcon>
            </StyledBadge>
          ) : (
            <StyledBadge
              max={99}
              classes={{
                badge: unreadMessages ? classes.unreadMessageCount : classes.emptyUnreadMessage
              }}
              badgeContent={unreadMessages}
              color="secondary"
            >
              <ListItemText
                classes={{
                  root: classes.itemContent
                }}
                primary={item.name.substring(0, 3).toUpperCase()}
              />
            </StyledBadge>
          )}
        </ListItem>
      )}
    </Tooltip>
  );
};

export default CommunityMenu;
