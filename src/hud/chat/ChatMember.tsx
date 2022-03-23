import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import { Box, ListItem, ListItemAvatar } from '@material-ui/core';

import { PROFILE_PAGE_SOURCE } from 'constants/common';
import { buildPath } from 'utils/helpers';

import Avatar from 'components/Avatar';
import HoverPopup from 'components/HoverPopup/HoverPopup';
import RoleBadge from 'components/RoleBadge/RoleBadge';

import { useStyles } from './HudChatStyles';

import type { HudChatState } from '../chatState/hudChatState';
import type { Action, Dispatch } from 'redux';
import type { Classmate } from 'types/models';

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
          <Avatar
            isOnline={member.isOnline}
            onlineBadgeBackground="circleIn.palette.primaryBackground"
            profileImage={member.image}
            fullName={member.fullName}
            fromChat
          />
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
