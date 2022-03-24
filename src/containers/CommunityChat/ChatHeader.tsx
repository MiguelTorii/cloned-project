import { useCallback, useMemo, useState } from 'react';

import { useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconShare from '@material-ui/icons/Share';

import { PERMISSIONS } from 'constants/common';
import { CHANNEL_SID_NAME } from 'constants/enums';
import { getInitials } from 'utils/chat';

import { logEvent } from 'api/analytics';
import { addGroupMembers, sendMessage } from 'api/chat';
import { searchUsers } from 'api/user';
import { ReactComponent as ChatActiveStudyRoomMembers } from 'assets/svg/chat-active-studyroom-members.svg';
import { ReactComponent as ChatAddMember } from 'assets/svg/chat-addmember.svg';
import { ReactComponent as ChatStudyRoomMembers } from 'assets/svg/chat-studyroom-members.svg';
import { ReactComponent as ChatStudyRoom } from 'assets/svg/chat-studyroom.svg';
import { ReactComponent as ChatIcon } from 'assets/svg/community-chat.svg';
import CreateChatChannelDialog from 'components/CreateChatChannelDialog/CreateChatChannelDialog';
import RemoveStudentDialog from 'components/RemoveStudentDialog/RemoveStudentDialog';
import ShareLinkDialog from 'components/ShareLinkDialog/ShareLinkDialog';

import useStyles from './_styles/chatHeader';

import type { ChannelMetadata } from 'features/chat';
import type { UserState } from 'reducers/user';
import type { Channel } from 'twilio-chat';

type Props = {
  channel: Channel;
  currentUserName: string;
  handleUpdateGroupName?: (...args: Array<any>) => any;
  isCommunityChat: boolean;
  memberKeys: Array<any>;
  members: ChannelMetadata['users'];
  onOpenRightPanel?: (...args: Array<any>) => any;
  otherUser: any;
  rightSpace?: number;
  startVideo?: (...args: Array<any>) => any;
  title: string;
};

const ChatHeader = ({
  channel,
  currentUserName,
  handleUpdateGroupName,
  isCommunityChat,
  memberKeys,
  members,
  onOpenRightPanel,
  otherUser,
  rightSpace,
  startVideo,
  title
}: Props) => {
  const classes = useStyles();
  const [channelType, setChannelType] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openShareLink, setOpenShareLink] = useState(false);
  const [editGroupDetailsOpen, setEditGroupDetailsOpen] = useState(false);
  const [openRemoveStudent, setOpenRemoveStudent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [membersEl, setMembersEl] = useState(null);

  const user = useSelector((state: { user: UserState }) => state.user);

  const handleClick = (event) => {
    setMembersEl(event.currentTarget);
  };

  const handleClose = () => {
    setMembersEl(null);
  };

  const handleOpenGroupDetailMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseGroupDetailMenu = useCallback(() => {
    setAnchorEl(null);
  }, []);
  const open = Boolean(anchorEl);
  const id = open ? 'group-details' : undefined;
  const {
    data: { userId, schoolId, permission }
  } = user;

  const isShow = useMemo(
    () =>
      permission &&
      permission.includes(PERMISSIONS.EDIT_GROUP_PHOTO_ACCESS) &&
      permission.includes(PERMISSIONS.RENAME_GROUP_CHAT_ACCESS),
    [permission]
  );
  const temporaryAddMemberPermissionOfCommunityChat = useMemo(
    () => permission && permission.includes(PERMISSIONS.EDIT_GROUP_PHOTO_ACCESS),
    [permission]
  );
  const deletePermission = useMemo(
    () => permission && permission.includes(PERMISSIONS.REMOVE_USER_GROUP_CHAT_ACCESS),
    [permission]
  );
  const showThreeDotsMenu = useMemo(
    () => (members && Object.keys(members).length > 2 && isShow) || deletePermission,
    [deletePermission, members, isShow]
  );
  const handleEditGroupDetailsClose = useCallback(() => setEditGroupDetailsOpen(false), []);
  const handleEditGroupDetailsOpen = useCallback(() => setEditGroupDetailsOpen(true), []);
  const handleCreateChannelClose = useCallback(() => setChannelType(null), []);
  const handleCreateChannelOpen = useCallback(() => setChannelType('group'), []);
  const handleShareLink = useCallback(() => {
    setOpenShareLink(true);
    handleCloseGroupDetailMenu();
  }, [handleCloseGroupDetailMenu]);
  const closeShareLinkDialog = useCallback(() => {
    setOpenShareLink(false);
  }, []);
  const handleLoadOptions = useCallback(
    async ({ query, from }) => {
      if (query.trim() === '' || query.trim().length < 3) {
        return {
          options: [],
          hasMore: false
        };
      }

      const users = await searchUsers({
        userId,
        query,
        schoolId: from === 'school' ? Number(schoolId) : undefined
      });
      const memberIds: number[] = members.map((m) => Number(m.userId));
      const options = users
        .map((user) => {
          const name = `${user.firstName} ${user.lastName}`;
          const initials = getInitials(name);
          return {
            value: user.userId,
            label: name,
            school: user.school,
            grade: user.grade,
            avatar: user.profileImageUrl,
            initials,
            userId: String(user.userId),
            firstName: user.firstName,
            lastName: user.lastName,
            relationship: user.relationship
          };
        })
        .filter((o) => !memberIds.includes(o.value));
      return {
        options,
        hasMore: false
      };
    },
    [userId, schoolId, members]
  );
  const onSubmit = useCallback(
    async ({ selectedUsers }) => {
      setLoading(true);

      try {
        await addGroupMembers({
          chatId: channel.sid,
          users: selectedUsers.map((user) => Number(user.userId))
        });
        selectedUsers.forEach(async (user) => {
          const messageAttributes = {
            firstName: user.firstName,
            lastName: user.lastName,
            imageKey: 'add_new_member'
          };
          await sendMessage({
            message: `${user.firstName} ${user.lastName} was added to the chat`,
            chatId: channel.sid,
            ...messageAttributes
          });
          logEvent({
            event: 'Chat- Send Message',
            props: {
              Content: 'Text',
              [CHANNEL_SID_NAME]: channel.sid
            }
          });
        });
      } finally {
        setLoading(false);
        handleCreateChannelClose();
      }
    },
    [channel, handleCreateChannelClose]
  );
  const handleEditGroup = useCallback(() => {
    handleEditGroupDetailsOpen();
    handleCloseGroupDetailMenu();
  }, [handleCloseGroupDetailMenu, handleEditGroupDetailsOpen]);
  const handleRemoveStudent = useCallback(() => {
    setOpenRemoveStudent(true);
    handleCloseGroupDetailMenu();
  }, [handleCloseGroupDetailMenu]);
  const handleCloseRemoveStudent = useCallback(() => {
    setOpenRemoveStudent(false);
  }, []);

  const renderOtherMembers = useCallback(
    () => (
      <List component="nav" aria-label="secondary mailbox folders">
        {members.map((member, index) => {
          if (index > 2) {
            return (
              <ListItem button key={member.userId}>
                <ListItemText primary={`${member.firstName} ${member.lastName}`} />
              </ListItem>
            );
          }

          return null;
        })}
      </List>
    ),
    [members]
  );

  const openMembers = Boolean(membersEl);
  const openMemberId = openMembers ? 'simple-popover' : undefined;

  return (
    <div className={classes.header}>
      {channel && (
        <Grid container justifyContent="space-between">
          <Typography className={classes.headerTitle}>
            <ChatIcon className={classes.headerIcon} /> {title}
            {/* Use `any` type because `Property 'channelState' is private and only accessible within class 'Channel'.` */}
            {members.length > 3 && !(channel as any).channelState.friendlyName && (
              <ArrowDropDownIcon onClick={handleClick} />
            )}
          </Typography>

          <Popover
            id={openMemberId}
            open={openMembers}
            anchorEl={membersEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            getContentAnchorEl={null}
          >
            {renderOtherMembers()}
          </Popover>
          <div className={classes.chatIcons}>
            {(otherUser?.registered || memberKeys.length > 2) && (
              <IconButton aria-label="study-room" className={classes.chatIcon} onClick={startVideo}>
                <ChatStudyRoom />
              </IconButton>
            )}
            {!isCommunityChat && (
              <IconButton
                aria-label="add-member"
                className={classes.chatIcon}
                onClick={handleCreateChannelOpen}
              >
                <ChatAddMember />
              </IconButton>
            )}
            {isCommunityChat && temporaryAddMemberPermissionOfCommunityChat && (
              <IconButton
                aria-label="add-member"
                className={classes.chatIcon}
                onClick={handleCreateChannelOpen}
              >
                <ChatAddMember />
              </IconButton>
            )}
            {Object.keys(members).length > 0 && (
              <IconButton
                aria-label="studyroom-members"
                className={classes.chatIcon}
                onClick={onOpenRightPanel}
              >
                {rightSpace ? <ChatActiveStudyRoomMembers /> : <ChatStudyRoomMembers />}
              </IconButton>
            )}
            {!isCommunityChat && (
              <IconButton
                aria-label="share-link"
                className={classes.chatIcon}
                onClick={handleShareLink}
              >
                <IconShare className={classes.grayIcon} />
              </IconButton>
            )}
            {showThreeDotsMenu && (
              <IconButton
                aria-label="group-details"
                className={classes.chatIcon}
                onClick={handleOpenGroupDetailMenu}
              >
                <MoreVertIcon />
              </IconButton>
            )}

            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleCloseGroupDetailMenu}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              getContentAnchorEl={null}
            >
              <Paper className={classes.paper}>
                <MenuList>
                  {Object.keys(members).length > 2 && isShow && (
                    <MenuItem onClick={handleEditGroup}>Edit Group Details</MenuItem>
                  )}
                  {deletePermission && (
                    <MenuItem onClick={handleRemoveStudent} className={classes.removeStudent}>
                      Remove Students
                    </MenuItem>
                  )}
                </MenuList>
              </Paper>
            </Popover>
          </div>
        </Grid>
      )}
      {/* TODO Fix merge */}
      {/* <EditGroupDetailsDialog
        title="Edit Group Details"
        metadata={channel}
        channel={local[channel.sid]}
        open={editGroupDetailsOpen}
        updateGroupName={handleUpdateGroupName}
        onClose={handleEditGroupDetailsClose}
      /> */}
      <CreateChatChannelDialog
        title="ADD CLASSMATES"
        chatType={channelType}
        onClose={handleCreateChannelClose}
        onLoadOptions={handleLoadOptions}
        members={members}
        onSubmit={onSubmit}
        isLoading={loading}
        okLabel="Add Classmates"
      />
      <RemoveStudentDialog
        open={openRemoveStudent}
        onClose={handleCloseRemoveStudent}
        currentUserName={currentUserName}
        members={members}
        channel={channel}
        isCommunityChat
      />
      {channel && (
        <ShareLinkDialog
          open={openShareLink}
          channelId={channel.sid}
          handleClose={closeShareLinkDialog}
        />
      )}
    </div>
  );
};

export default ChatHeader;
