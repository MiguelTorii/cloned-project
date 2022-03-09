import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import Avatar from 'components/Avatar';
import RoleBadge from 'components/RoleBadge/RoleBadge';
import HoverPopup from 'components/HoverPopup/HoverPopup';
import useStyles from './_styles/rightMenu';
import ShareLinkWidget from 'components/ShareLinkWidget/ShareLinkWidget';
import { PROFILE_PAGE_SOURCE } from 'constants/common';
import { buildPath } from 'utils/helpers';
import { useChannelMetadataById, useChatShareLink } from 'features/chat';
import { selectLocalById } from 'redux/chat/selectors';
import { useAppSelector } from 'redux/store';

const MyLink = React.forwardRef<any, any>(({ link, ...props }, ref) => (
  <RouterLink to={link} {...props} ref={ref} />
));

type Props = {
  channelId: string;
  isCommunityChat?: boolean;
};

const RightMenu = ({ channelId, isCommunityChat }: Props) => {
  const classes = useStyles();
  const { data: channelMetadata } = useChannelMetadataById(channelId);
  const { data: shareLink } = useChatShareLink(channelId);
  const local = useAppSelector((state) => selectLocalById(state, channelId));

  const users = channelMetadata?.users || local?.users || [];

  return (
    <Box display="flex" flexDirection="column" className={classes.container}>
      <Grid
        container
        alignItems="flex-start"
        justifyContent="flex-start"
        classes={{
          root: classes.header
        }}
        item
      />
      <Grid
        classes={{
          root: classes.usersContainer
        }}
      >
        <Typography className={classes.usersTitle}>Members - {users?.length}</Typography>
        <List dense className={classes.listRoot}>
          {users.map((m) => {
            const fullName = `${m.firstName} ${m.lastName}`;
            return (
              <HoverPopup userId={m.userId} key={m.userId} profileSource={PROFILE_PAGE_SOURCE.CHAT}>
                <ListItem
                  component={MyLink}
                  disableGutters
                  link={buildPath(`/profile/${m.userId}`, {
                    from: PROFILE_PAGE_SOURCE.CHAT
                  })}
                  button
                  classes={{
                    secondaryAction: classes.secondaryAction
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      isOnline={m.isOnline}
                      onlineBadgeBackground="circleIn.palette.primaryBackground"
                      profileImage={m.profileImageUrl}
                      fullName={fullName}
                      fromChat
                    />
                  </ListItemAvatar>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    className={classes.memberName}
                  >
                    {fullName}
                    {m.roleId !== 1 && <RoleBadge />}
                  </Box>
                </ListItem>
              </HoverPopup>
            );
          })}
        </List>
      </Grid>
      {!isCommunityChat && (
        <Box padding={2}>
          <ShareLinkWidget shareLink={shareLink} headerText="Share an invite link" />
        </Box>
      )}
    </Box>
  );
};

export default React.memo(RightMenu);
