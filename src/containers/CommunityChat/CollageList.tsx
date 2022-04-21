import React from 'react';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';

import CommunityMenu from 'components/CommunityMenu';

import useStyles from './_styles/collageList';
import DEFAULT_COMMUNITY_MENU_ITEMS from './constants';

import type { ChatCommunity, ChatCommunityData } from 'api/models/APICommunity';
import type { ChatCommunityWithChannels } from 'reducers/chat';

type Props = {
  activeCommunities: ChatCommunityData[];
  communityChannels: ChatCommunityWithChannels[];
  handleSelect: (course: ChatCommunity) => void;
};

const CollageList = ({ activeCommunities, communityChannels, handleSelect }: Props) => {
  const classes = useStyles();

  return (
    <List component="nav">
      {/* TODO Create separate default community menu item component */}
      <CommunityMenu key="chat" item={DEFAULT_COMMUNITY_MENU_ITEMS} handleSelect={handleSelect} />
      <Divider
        classes={{
          root: classes.divider
        }}
      />
      {!!communityChannels?.length &&
        activeCommunities.map((course) => (
          <CommunityMenu
            key={course.community.id}
            item={course.community}
            handleSelect={handleSelect}
          />
        ))}
    </List>
  );
};

export default CollageList;
