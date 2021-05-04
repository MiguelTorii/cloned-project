// @flow
import React, { useMemo } from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { COURSE_GROUPS_CHANNLES } from 'containers/CommunityChat/constants'
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

  const unreadMessages = useMemo(() => {
    let count = 0;
    if (local && !!Object.keys(local).length) {
      COURSE_GROUPS_CHANNLES.forEach(category =>
        category.channels.forEach(channel => {
          count += local[channel.id].unread
        })
      )
    }
    return count
  }, [local])

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
      backgroundColor: item.color
    }}>
    {['chat'].indexOf(item.id) > -1
      ? <StyledBadge max={99} badgeContent={unreadMessageCount} color="secondary">
        <ListItemIcon classes={{ root: classes.itemContent }}>
          <Chat />
        </ListItemIcon>
      </StyledBadge>
      : <StyledBadge max={99} badgeContent={unreadMessages} color="secondary">
        <ListItemText
          classes={{ root: classes.itemContent }}
          primary={item.name}
        />
      </StyledBadge>}
  </ListItem>
}

export default CommunityMenu