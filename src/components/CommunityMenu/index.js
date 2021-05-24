// @flow
import React, { useState, useEffect } from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { getCommunityChannels } from 'api/community'
import LoadImg from 'components/LoadImg'
import { ReactComponent as Chat } from 'assets/svg/community-chat.svg'
import StyledBadge from './StyledBadge'
import useStyles from './_styles/styles'

type Props = {
  item: Object,
  local: Object,
  unreadMessageCount: number,
  selectedCourse: Object,
  handleSelect: Function
};

const CommunityMenu = ({
  item,
  local,
  unreadMessageCount,
  selectedCourse,
  handleSelect
}: Props) => {
  const classes = useStyles()
  const [unreadMessages, setUnreadMessages] = useState(0)
  useEffect(() => {
    async function fetchCommunityChannels() {
      const { id } = item
      if (id !== 'chat') {
        const { community_channels: communityChannels } = await getCommunityChannels({ communityId: id })
        let count = 0
        communityChannels.forEach(communityChannel => {
          communityChannel.channels.forEach(channel => {
            if (local[channel.chat_id]?.unread) {
              count += local[channel.chat_id].unread
            }
          })
        })
        setUnreadMessages(count)
      }
    }
    fetchCommunityChannels()
  }, [item, local])

  return item.communityIconUrl ? (
    <ListItem
      button
      onClick={handleSelect(item)}
      selected={selectedCourse && selectedCourse.id === item.id}
      classes={{ root: classes.listItem, selected: classes.selectedItem }}
    >
      <StyledBadge max={99} badgeContent={unreadMessages} color="secondary">
        <ListItemIcon classes={{ root: classes.itemContent }}>
          <LoadImg url={item.communityIconUrl} />
        </ListItemIcon>
      </StyledBadge>
    </ListItem>
  ) : <ListItem
    button
    onClick={handleSelect(item)}
    selected={selectedCourse && selectedCourse.id === item.id}
    classes={{ root: classes.listItem, selected: classes.selectedItem }}
    style={{
      backgroundColor: item.color ? item.color : '#C45960'
    }}>
    {['chat'].indexOf(item.id) > -1
      ? <StyledBadge max={99} badgeContent={unreadMessageCount} color="secondary">
        <ListItemIcon classes={{ root: classes.itemContent }}>
          <Chat />
        </ListItemIcon>
      </StyledBadge>
      : <StyledBadge
        max={99}
        classes={{ badge: unreadMessages
          ? classes.unreadMessageCount
          : classes.emptyUnreadMessage
        }}
        badgeContent={unreadMessages || '🎉' }
        color="secondary"
      >
        <ListItemText
          classes={{ root: classes.itemContent }}
          primary={item.name.substring(0,3).toUpperCase()}
        />
      </StyledBadge>}
  </ListItem>
}

export default CommunityMenu