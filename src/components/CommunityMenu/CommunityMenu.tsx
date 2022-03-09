import React, { useCallback, useMemo } from 'react';
import { useAppSelector } from 'redux/store';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';

import LoadImg from '../LoadImg/LoadImg';
import { ReactComponent as Chat } from '../../assets/svg/community-chat.svg';
import StyledBadge from './StyledBadge';
import useStyles from './_styles/styles';
import { useUnreadCount } from 'features/chat';
import { ChatCommunity } from 'api/models/APICommunity';

type Props = {
  item: ChatCommunity;
  handleSelect: (course: ChatCommunity) => void;
};

const CommunityMenu = ({ item, handleSelect }: Props) => {
  const classes = useStyles();

  const { currentCommunity, communityChannels } = useAppSelector((state) => state.chat.data);

  const { data: unreadCountData } = useUnreadCount();

  const unreadCount = useMemo(() => {
    if (!communityChannels?.length || !unreadCountData) {
      return 0;
    }
    const { id } = item;

    if (!id) {
      return 0;
    }

    const currentCourseChannel = communityChannels?.filter(
      (courseChannel) => courseChannel.courseId === id
    );

    if (!currentCourseChannel.length) {
      return 0;
    }

    // TODO From here and redux, rename and differenciate from course channel, community channel, and channels inside channels
    const channels = currentCourseChannel[0].channels;
    let count = 0;
    for (const communityChannel of channels) {
      for (const channel of communityChannel.channels) {
        count += unreadCountData[channel.chat_id] || 0;
      }
    }
    return count;
  }, [communityChannels, item, unreadCountData]);

  const handleSelectItem = useCallback(() => {
    handleSelect(item);
  }, [handleSelect, item]);

  return (
    <Tooltip
      title={!item.id ? 'Direct Chat' : item.name}
      placement="top"
      arrow
      classes={{
        tooltip: classes.tooltip
      }}
    >
      {item.community_icon_url ? (
        <ListItem
          button
          onClick={handleSelectItem}
          selected={Boolean(currentCommunity?.id === item.id)}
          classes={{
            root: classes.listItem,
            selected: classes.selectedItem
          }}
        >
          <StyledBadge max={99} badgeContent={unreadCount} color="secondary">
            <ListItemIcon
              classes={{
                root: classes.itemContent
              }}
            >
              <LoadImg url={item.community_icon_url} />
            </ListItemIcon>
          </StyledBadge>
        </ListItem>
      ) : (
        <ListItem
          button
          onClick={handleSelectItem}
          selected={Boolean(currentCommunity?.id === item.id)}
          classes={{
            root: classes.listItem,
            selected: classes.selectedItem
          }}
          style={{
            backgroundColor: item.bg_color ? item.bg_color : '#C45960'
          }}
        >
          {!item.id ? (
            <StyledBadge max={99} badgeContent={unreadCount} color="secondary">
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
                badge: unreadCount ? classes.unreadMessageCount : classes.emptyUnreadMessage
              }}
              badgeContent={unreadCount}
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
