import React from 'react';
import { Action, Dispatch } from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import LoadImg from '../../components/LoadImg/LoadImg';
import StyledBadge from '../../components/CommunityMenu/StyledBadge';
import useStyles from './CommunityPickerStyles';
import { CommunityData, HudChatState } from '../chatState/hudChatState';
import { selectCommunityId } from '../chatState/hudChatActions';

type Props = {
  communityId: string;
};

const CommunityPick = ({ communityId }: Props) => {
  const classes: any = useStyles();

  const dispatch: Dispatch<Action> = useDispatch();

  const selectedCommunityId: string = useSelector(
    (state: { hudChat: HudChatState }) => state.hudChat.selectedCommunityId
  );
  const communityData: CommunityData = useSelector(
    (state: { hudChat: HudChatState }) => state.hudChat.idToCommunity[communityId]
  );

  const setCommunityId = () => {
    dispatch(selectCommunityId(communityId));
  };

  return (
    communityData && (
      <Tooltip
        title={communityData.displayName}
        placement="top"
        arrow
        classes={{
          tooltip: classes.tooltip
        }}
      >
        {communityData.iconUrl ? (
          <ListItem
            button
            onClick={setCommunityId}
            selected={communityId === selectedCommunityId}
            classes={{
              root: classes.listItem,
              selected: classes.selectedItem
            }}
          >
            <StyledBadge max={99} badgeContent={communityData.unreadCount} color="secondary">
              <ListItemIcon
                classes={{
                  root: classes.itemContent
                }}
              >
                <LoadImg url={communityData.iconUrl} />
              </ListItemIcon>
            </StyledBadge>
          </ListItem>
        ) : (
          <ListItem
            button
            onClick={setCommunityId}
            selected={communityId === selectedCommunityId}
            classes={{
              root: classes.listItem,
              selected: classes.selectedItem
            }}
            style={{
              backgroundColor: communityData.color ? communityData.color : '#C45960'
            }}
          >
            <StyledBadge
              max={99}
              classes={{
                badge: communityData.unreadCount
                  ? classes.unreadMessageCount
                  : classes.emptyUnreadMessage
              }}
              badgeContent={communityData.unreadCount}
              color="secondary"
            >
              <ListItemText
                classes={{
                  root: classes.itemContent
                }}
                primary={communityData.displayName.substring(0, 3).toUpperCase()}
              />
            </StyledBadge>
          </ListItem>
        )}
      </Tooltip>
    )
  );
};

export default CommunityPick;
