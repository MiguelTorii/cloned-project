import React, { useCallback, useMemo } from 'react';

import clsx from 'clsx';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';

import { ReactComponent as Chat } from 'assets/svg/community-chat.svg';
import { useUnreadCount } from 'features/chat';
import { selectCurrentCommunity } from 'reducers/chat';
import { useAppSelector } from 'redux/store';

import LoadImg from '../LoadImg/LoadImg';

import useStyles from './CommunityMenuStyles';
import StyledBadge from './StyledBadge';

import type { ChatCommunity } from 'api/models/APICommunity';

type Props = {
  item: ChatCommunity;
  handleSelect: (course: ChatCommunity) => void;
  classes?: {
    badge?: string;
    listItem?: string;
  };
  selected?: boolean;
};

const CommunityMenu: React.FC<Props> = ({
  item,
  handleSelect,
  selected,
  classes: externalClasses = {}
}) => {
  const classes = useStyles();

  const { communityChannels } = useAppSelector((state) => state.chat.data);
  const currentCommunity = useAppSelector(selectCurrentCommunity);

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

  const isSelected =
    typeof selected !== 'undefined' ? selected : Boolean(currentCommunity?.id === item.id);

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
          selected={isSelected}
          classes={{
            root: clsx(
              classes.listItem,
              !item.active_course_community && classes.pastClassItem,
              externalClasses.listItem
            ),
            selected: classes.selectedItem
          }}
        >
          <StyledBadge
            max={99}
            badgeContent={unreadCount}
            color="secondary"
            className={externalClasses.badge}
          >
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
          selected={isSelected}
          classes={{
            root: clsx(
              classes.listItem,
              !item.active_course_community && classes.pastClassItem,
              externalClasses.listItem
            ),
            selected: classes.selectedItem
          }}
          style={{
            backgroundColor: item.bg_color ? item.bg_color : '#C45960'
          }}
        >
          {!item.id ? (
            <StyledBadge
              max={99}
              badgeContent={unreadCount}
              color="secondary"
              className={externalClasses.badge}
            >
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
              className={externalClasses.badge}
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
