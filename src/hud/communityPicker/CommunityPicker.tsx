import React from 'react';
import { useSelector } from 'react-redux';
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
      {communityIdsInDisplayOrder.map((communityId) => (
        <CommunityPick key={communityId} communityId={communityId} />
      ))}
    </div>
  );
};

export default CommunityPicker;
