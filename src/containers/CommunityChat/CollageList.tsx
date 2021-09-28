import React from 'react';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import CommunityMenu from '../../components/CommunityMenu/CommunityMenu';
import useStyles from './_styles/collageList';
import DEFAULT_COMMUNITY_MENU_ITEMS from './constants';

type Props = {
  unreadMessageCount: number;
  selectedCourse: any;
  communities: any[];
  local: Record<string, any>;
  communityChannels: any[];
  handleSelect: (...args: Array<any>) => any;
};

const CollageList = ({
  unreadMessageCount,
  selectedCourse,
  communities,
  local,
  communityChannels,
  handleSelect
}: Props) => {
  const classes: any = useStyles();
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
      <Divider
        classes={{
          root: classes.divider
        }}
      />
      {!!communityChannels?.length &&
        communities.map((course) => (
          <CommunityMenu
            key={course.community.id}
            local={local}
            item={course.community}
            communityChannels={communityChannels}
            unreadMessageCount={unreadMessageCount}
            selectedCourse={selectedCourse}
            handleSelect={handleSelect}
          />
        ))}
    </List>
  );
};

export default CollageList;
