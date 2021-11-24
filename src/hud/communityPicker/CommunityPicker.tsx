import React, { useEffect } from 'react';
import { Action, Dispatch } from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import DEFAULT_COMMUNITY_MENU_ITEMS from '../../containers/CommunityChat/constants';
import { HudChatState } from '../chatState/hudChatState';
import CommunityPick from './CommunityPick';
import useStyles from './CommunityPickerStyles';
import { selectCommunityId } from '../chatState/hudChatActions';

const CommunityPicker = () => {
  const classes: any = useStyles();

  const dispatch: Dispatch<Action> = useDispatch();

  const communityIdsInDisplayOrder = useSelector(
    (state: { hudChat: HudChatState }) => state.hudChat.communityIdsInDisplayOrder
  );

  const selectedCommunityId: string = useSelector(
    (state: { hudChat: HudChatState }) => state.hudChat.selectedCommunityId
  );

  useEffect(() => {
    // TODO try a better check here that enables chat to be chosen.
    if (!selectedCommunityId || selectedCommunityId === DEFAULT_COMMUNITY_MENU_ITEMS.id) {
      const firstNonChatCommunityId = communityIdsInDisplayOrder[1];
      if (firstNonChatCommunityId) {
        dispatch(selectCommunityId(firstNonChatCommunityId));
      }
    }
  }, [communityIdsInDisplayOrder, selectedCommunityId]);

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
