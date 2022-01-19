import React from 'react';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import CommunityMenu from '../../components/CommunityMenu/CommunityMenu';
import useStyles from './_styles/collageList';
import DEFAULT_COMMUNITY_MENU_ITEMS from './constants';

type Props = {
  unreadMessageCount: number;
  communities: any[];
  communityChannels: any[];
  handleSelect: (...args: Array<any>) => any;
};

const CollageList = ({
  unreadMessageCount,
  communities,
  communityChannels,
  handleSelect
}: Props) => {
  const classes: any = useStyles();
  return (
    <List component="nav">
      <CommunityMenu
        key="chat"
        item={DEFAULT_COMMUNITY_MENU_ITEMS}
        unreadMessageCount={unreadMessageCount}
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
            item={course.community}
            communityChannels={communityChannels}
            unreadMessageCount={unreadMessageCount}
            handleSelect={handleSelect}
          />
        ))}
    </List>
  );
};

export default CollageList;
