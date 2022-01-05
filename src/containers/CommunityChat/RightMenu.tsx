import React, { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { getInitials } from '../../utils/chat';
import OnlineBadge from '../../components/OnlineBadge/OnlineBadge';
import RoleBadge from '../../components/RoleBadge/RoleBadge';
import HoverPopup from '../../components/HoverPopup/HoverPopup';
import useStyles from './_styles/rightMenu';
import ShareLinkWidget from '../../components/ShareLinkWidget/ShareLinkWidget';
import { PROFILE_PAGE_SOURCE } from '../../constants/common';
import { buildPath } from '../../utils/helpers';
import { ChannelWrapper } from '../../reducers/chat';

const MyLink = React.forwardRef<any, any>(({ link, ...props }, ref) => (
  <RouterLink to={link} {...props} ref={ref} />
));

type Props = {
  local?: Record<string, ChannelWrapper>;
  channel?: any;
  isCommunityChat?: any;
  userId?: any;
  schoolId?: any;
  handleRemoveChannel?: any;
};

const RightMenu = ({
  local,
  channel,
  isCommunityChat,
  userId,
  schoolId,
  handleRemoveChannel
}: Props) => {
  const classes: any = useStyles();
  const localChannel = useMemo(() => channel && local[channel.sid], [channel, local]);

  if (!channel || !localChannel) {
    return null;
  }

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
      >
        {
          // eslint-disable-next-line react/jsx-closing-tag-location
        }
      </Grid>
      <Grid
        classes={{
          root: classes.usersContainer
        }}
      >
        <Typography className={classes.usersTitle}>
          Members - {localChannel?.members?.length}
        </Typography>
        <List dense className={classes.listRoot}>
          {localChannel?.members.map((m) => {
            const fullName = `${m.firstname} ${m.lastname}`;
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
                    <OnlineBadge
                      isOnline={m.isOnline}
                      bgColorPath="circleIn.palette.primaryBackground"
                    >
                      <Avatar alt={fullName} src={m.image}>
                        {getInitials(fullName)}
                      </Avatar>
                    </OnlineBadge>
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
          <ShareLinkWidget shareLink={localChannel.shareLink} headerText="Share an invite link" />
        </Box>
      )}
    </Box>
  );
};

export default React.memo(RightMenu);
