// @flow
import React from 'react'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'

import CommunityMenu from 'components/CommunityMenu'
import useStyles from './_styles/collageList'

import {
  DEFAULT_COMMUNITY_MENU_ITEMS,
  COMMUNITY_MENU,
} from './constants'

type Props = {
  unreadMessageCount: number,
  selectedCourse: any,
  local: Object,
  handleSelect: Function
};

const CollageList = ({
  unreadMessageCount,
  selectedCourse,
  local,
  handleSelect
}: Props) => {
  const classes = useStyles()

  return <List component="nav">
    <CommunityMenu
      key="chat"
      local={local}
      item={DEFAULT_COMMUNITY_MENU_ITEMS}
      unreadMessageCount={unreadMessageCount}
      selectedCourse={selectedCourse}
      handleSelect={handleSelect}
    />
    <Divider classes={{ root: classes.divider }} />
    {COMMUNITY_MENU.map(course => (
      <CommunityMenu
        key={course.id}
        local={local}
        item={course}
        unreadMessageCount={unreadMessageCount}
        selectedCourse={selectedCourse}
        handleSelect={handleSelect}
      />
    ))}
  </List>
}

export default CollageList