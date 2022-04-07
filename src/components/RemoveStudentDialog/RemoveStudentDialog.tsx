/* eslint-disable no-nested-ternary */
import React, { useCallback, useState } from 'react';

import cx from 'classnames';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { CHANNEL_SID_NAME } from 'constants/enums';

import { logEvent } from 'api/analytics';
import { removeUser, sendMessage, addGroupMembers } from 'api/chat';
import { ReactComponent as ChatSearchIcon } from 'assets/svg/chat-search.svg';
import { ReactComponent as UndoIcon } from 'assets/svg/undo.svg';
import Avatar from 'components/Avatar';

import useStyles from '../_styles/RemoveStudentDialog';
import Dialog from '../Dialog/Dialog';
import RoleBadge from '../RoleBadge/RoleBadge';

import type { ChannelMetadata } from 'features/chat';
import type { Channel } from 'twilio-chat';

interface Props {
  open: boolean;
  onClose: () => void;
  members: ChannelMetadata['users'];
  channel: Channel;
  currentUserName: string;
  isCommunityChat: boolean;
}

const RemoveStudentDialog = ({
  open,
  onClose,
  members,
  channel,
  currentUserName,
  isCommunityChat = false
}: Props) => {
  const classes: any = useStyles();
  const [search, searchMember] = useState('');
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [user, setUser] = useState<ChannelMetadata['users'][0] | null>(null);
  const [removedUserIds, setRemovedUserIds] = useState<number[]>([]);
  const handleCloseConfirmModal = useCallback(() => {
    setConfirmDialog(false);
    setUser(null);
  }, []);

  const removeUserFromChannel = useCallback(async () => {
    if (!user) return;
    const messageAttribute = {
      firstName: user.firstName,
      lastName: user.lastName,
      imageKey: 'remove_user'
    };
    const response = await removeUser(user.userId, channel.sid);

    if (response) {
      await sendMessage({
        message: `${currentUserName} removed ${user.firstName} ${user.lastName} from the chat`,
        chatId: channel.sid,
        ...messageAttribute
      });
      logEvent({
        event: 'Chat- Send Message',
        props: {
          Content: 'Text',
          [CHANNEL_SID_NAME]: channel.sid
        }
      });
    }

    setUser(null);
    setConfirmDialog(false);
  }, [channel, user, currentUserName]);

  const removeMember = useCallback(
    async (member) => {
      if (isCommunityChat) {
        setUser(member);
        setConfirmDialog(true);
        return;
      }

      const response = await removeUser(member.userId, channel.sid);

      if (response) {
        const removedUserIdArr = [Number(member.userId), ...removedUserIds];
        setRemovedUserIds(removedUserIdArr);
      }
    },
    [channel, isCommunityChat, removedUserIds]
  );
  const handleUndo = useCallback(
    async (memberId) => {
      const response = await addGroupMembers({
        chatId: channel.sid,
        users: [memberId]
      });

      if (response) {
        const removedUserIdArr = [...removedUserIds].filter(
          (removeUserId) => removeUserId !== Number(memberId)
        );
        setRemovedUserIds(removedUserIdArr);
      }
    },
    [removedUserIds, channel]
  );
  const searchStudentName = useCallback((e) => {
    searchMember(e.target.value);
  }, []);
  return (
    <>
      <Dialog
        open={open}
        title="Remove Student"
        className={classes.dialog}
        hrClass={classes.hrClass}
        onCancel={onClose}
      >
        {isCommunityChat && (
          <Paper component="form" className={classes.searchStudent}>
            <IconButton className={classes.iconButton} aria-label="menu">
              <ChatSearchIcon />
            </IconButton>
            <InputBase
              className={classes.input}
              onChange={searchStudentName}
              placeholder="Search for students"
              inputProps={{
                'aria-label': 'search for students'
              }}
              value={search}
            />
          </Paper>
        )}
        <List dense className={classes.listRoot}>
          {members
            .filter((member) => `${member.firstName} ${member.lastName}`.includes(search))
            .map((m) => {
              const fullName = `${m.firstName} ${m.lastName}`;
              return (
                <ListItem
                  key={m.userId}
                  disableGutters
                  button
                  classes={{
                    secondaryAction: classes.secondaryAction
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      isOnline={m.isOnline}
                      onlineBadgeBackground="circleIn.palette.feedBackground"
                      profileImage={m.profileImageUrl}
                      fullName={fullName}
                      fromChat
                    />
                  </ListItemAvatar>
                  {fullName} {m.role && <RoleBadge text={m.role} />}
                  <ListItemSecondaryAction>
                    {!isCommunityChat && removedUserIds.includes(Number(m.userId)) && (
                      <Button onClick={() => handleUndo(m.userId)} className={classes.undo}>
                        <UndoIcon className={classes.spacing} /> Undo
                      </Button>
                    )}
                    <Button
                      onClick={() => removeMember(m)}
                      className={cx(
                        isCommunityChat
                          ? classes.removeUser
                          : removedUserIds.includes(Number(m.userId))
                          ? classes.removedUser
                          : classes.removeUser
                      )}
                    >
                      {isCommunityChat
                        ? 'Remove'
                        : removedUserIds.includes(Number(m.userId))
                        ? 'Removed'
                        : 'Remove'}
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
        </List>
      </Dialog>
      <Dialog
        open={confirmDialog}
        title={`${user?.firstName} ${user?.lastName}?`}
        className={classes.dialog}
        hrClass={classes.hrClass}
        okButtonClass={classes.okButtonClass}
        closeButtonClass={classes.closeButtonClass}
        onCancel={handleCloseConfirmModal}
        onOk={removeUserFromChannel}
        showActions
        showCancel
        okTitle="Yes, Remove"
        cancelTitle="Cancel"
      >
        <Typography variant="subtitle1">
          Are you sure you want to remove <b>{`${user?.firstName} ${user?.lastName}`}</b>? They will
          be removed from the chat and will no longer have access to it.
        </Typography>
      </Dialog>
    </>
  );
};

export default RemoveStudentDialog;
