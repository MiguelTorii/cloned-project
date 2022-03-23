import React, { useEffect } from 'react';

import { useSelector } from 'react-redux';

import CommunityPick from './CommunityPick';
import useStyles from './CommunityPickerStyles';

import type { HudChatState } from '../chatState/hudChatState';

const CommunityPicker = () => {
  const classes: any = useStyles();

  const communityIdsInDisplayOrder = useSelector(
    (state: { hudChat: HudChatState }) => state.hudChat.communityIdsInDisplayOrder
  );

  return (
    <div className={classes.communityMenu}>
      {communityIdsInDisplayOrder.map((communityId) => (
        <CommunityPick key={communityId} communityId={communityId} />
      ))}
    </div>
  );
};

export default CommunityPicker;
