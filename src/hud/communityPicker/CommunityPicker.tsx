import React from 'react';
import { useSelector } from 'react-redux';
import DEFAULT_COMMUNITY_MENU_ITEMS from '../../containers/CommunityChat/constants';
import { HudChatState } from '../chatState/hudChatState';
import CommunityPick from './CommunityPick';
import useStyles from './CommunityPickerStyles';

const CommunityPicker = () => {
  const classes: any = useStyles();

  const communityIdsInDisplayOrder = useSelector(
    (state: { hudChat: HudChatState }) => state.hudChat.communityIdsInDisplayOrder
  );

  return (
    <div className={classes.communityMenu}>
      {communityIdsInDisplayOrder
        .filter((communityId) => communityId !== DEFAULT_COMMUNITY_MENU_ITEMS.id)
        .map((communityId) => (
          <CommunityPick key={communityId} communityId={communityId} />
        ))}
    </div>
  );
};

export default CommunityPicker;
