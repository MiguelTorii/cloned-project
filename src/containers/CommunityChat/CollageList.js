// @flow
import React from 'react';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

import CommunityMenu from 'components/CommunityMenu';
import useStyles from './_styles/collageList';

import DEFAULT_COMMUNITY_MENU_ITEMS from './constants';

type Props = {
  unreadMessageCount: number,
  selectedCourse: any,
  communities: array,
  local: Object,
  courseChannels: array,
  handleSelect: Function
};

const CollageList = ({
  unreadMessageCount,
  selectedCourse,
  communities,
  local,
  courseChannels,
  handleSelect,
}: Props) => {
  const classes = useStyles();

  return (
    <List component="nav">
      <CommunityMenu
        key="chat"
        local={local}
        item={DEFAULT_COMMUNITY_MENU_ITEMS}
        unreadMessageCount={unreadMessageCount}
        selectedCourse={selectedCourse}
        handleSelect={handleSelect}
      />
      <Divider classes={{ root: classes.divider }} />
      {communities.map((course) => (
        <CommunityMenu
          key={course.id}
          local={local}
          item={course}
          courseChannels={courseChannels}
          unreadMessageCount={unreadMessageCount}
          selectedCourse={selectedCourse}
          handleSelect={handleSelect}
        />
      ))}
    </List>
  );
};

export default CollageList;
