import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Action, Dispatch } from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar, Box, ListItem, ListItemAvatar } from '@material-ui/core';
import { useStyles } from './HudChatStyles';
import { PROFILE_PAGE_SOURCE } from '../../constants/common';
import { buildPath } from '../../utils/helpers';
import OnlineBadge from '../../components/OnlineBadge/OnlineBadge';
import { getInitials } from '../../utils/chat';
import RoleBadge from '../../components/RoleBadge/RoleBadge';
import HoverPopup from '../../components/HoverPopup/HoverPopup';
import { Classmate } from '../../types/models';
import { HudChatState } from '../chatState/hudChatState';

const MyLink = React.forwardRef<any, any>(({ link, ...props }, ref) => (
  <RouterLink to={link} {...props} ref={ref} />
));

type Props = {
  memberId: string;
};

const ChatMember = ({ memberId }: Props) => {
  const classes: any = useStyles();

  const dispatch: Dispatch<Action> = useDispatch();

  const selectedCommunityId: string = useSelector(
    (state: { hudChat: HudChatState }) => state.hudChat.selectedCommunityId
  );

  const member: Classmate = useSelector(
    (state: { hudChat: HudChatState }) =>
      state.hudChat.idToCommunity[selectedCommunityId].idToMember[memberId]
  );

  if (!member) {
    return null;
  }

  return (
    <HoverPopup userId={member.userId} key={member.userId} profileSource={PROFILE_PAGE_SOURCE.CHAT}>
      <ListItem
        component={MyLink}
        disableGutters
        link={buildPath(`/profile/${member.userId}`, {
          from: PROFILE_PAGE_SOURCE.CHAT
        })}
        button
        classes={{
          secondaryAction: classes.secondaryAction
        }}
      >
        <ListItemAvatar>
          <OnlineBadge isOnline={member.isOnline} bgColorPath="circleIn.palette.primaryBackground">
            <Avatar alt={member.fullName} src={member.image}>
              {getInitials(member.fullName)}
            </Avatar>
          </OnlineBadge>
        </ListItemAvatar>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          className={classes.memberName}
        >
          {member.fullName}
          {member.roleId !== 1 && <RoleBadge />}
        </Box>
      </ListItem>
    </HoverPopup>
  );
};

export default ChatMember;
