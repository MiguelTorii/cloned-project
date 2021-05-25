// @flow

import React, { useState, useMemo, useCallback } from 'react'
import { connect } from 'react-redux'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Popover from '@material-ui/core/Popover'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import CreateChatChannelDialog from 'components/CreateChatChannelDialog'
import ShareLinkDialog from 'components/ShareLinkDialog'
import EditGroupDetailsDialog from 'containers/Chat/EditGroupDetailsDialog'

import { searchUsers } from 'api/user'
import { addGroupMembers, sendMessage } from 'api/chat'
import { logEvent } from 'api/analytics'
import { ReactComponent as ChatIcon } from 'assets/svg/community-chat.svg'
import { ReactComponent as ChatStudyRoom } from 'assets/svg/chat-studyroom.svg'
import { ReactComponent as ChatAddMember } from 'assets/svg/chat-addmember.svg'
import { ReactComponent as ChatStudyRoomMemberrs } from 'assets/svg/chat-studyroom-members.svg'
import { ReactComponent as ChatActiveStudyRoomMemberrs } from 'assets/svg/chat-active-studyroom-members.svg'
import { PERMISSIONS } from 'constants/common'
import useStyles from './_styles/chatHeader'

type Props = {
  isCommunityChat: boolean,
  channel: Object,
  title: string,
  otherUser: Array,
  rightSpace: number,
  memberKeys: Array,
  videoEnabled: boolean,
  startVideo: Function,
  local: Object,
  user: Object,
  onOpenRightPanel: Function,
  handleUpdateGroupName: Function
};

const ChatHeader = ({
  isCommunityChat,
  channel,
  title,
  otherUser,
  rightSpace,
  memberKeys,
  videoEnabled,
  startVideo,
  local,
  user,
  onOpenRightPanel,
  handleUpdateGroupName,
}: Props) => {
  const classes = useStyles()
  const [channelType, setChannelType] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [openShareLink, setOpenShareLink] = useState(false)
  const [editGroupDetailsOpen, setEditGroupDetailsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleOpenGroupDetailMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseGroupDetailMenu = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? 'group-details' : undefined;

  const { data: { userId, schoolId, permission } } = user

  const members = useMemo(() => channel && local[channel.sid].members, [channel, local])
  const isShow = useMemo(() => permission &&
    permission.includes(PERMISSIONS.EDIT_GROUP_PHOTO_ACCESS) &&
    permission.includes(PERMISSIONS.RENAME_GROUP_CHAT_ACCESS), [permission])

  const temporaryAddMemberPermissionOfCommunityChat = useMemo(() => permission &&
    permission.includes(PERMISSIONS.EDIT_GROUP_PHOTO_ACCESS), [permission])

  const handleEditGroupDetailsClose = useCallback(() => setEditGroupDetailsOpen(false), [])
  const handleEditGroupDetailsOpen = useCallback(() => setEditGroupDetailsOpen(true), [])
  const handleCreateChannelClose = useCallback(() => setChannelType(null), [])
  const handleCreateChannelOpen = useCallback(() => setChannelType('group'), [])

  const handleShareLink = useCallback(() => {
    setOpenShareLink(true)
    handleCloseGroupDetailMenu()
  }, [handleCloseGroupDetailMenu])

  const closeShareLinkDialog = useCallback(() => {
    setOpenShareLink(false)
  }, [])

  const handleLoadOptions = useCallback(async ({ query, from }) => {
    if (query.trim() === '' || query.trim().length < 3)
      return {
        options: [],
        hasMore: false
      }

    const users = await searchUsers({
      userId,
      query,
      schoolId: from === 'school' ? Number(schoolId) : undefined
    })

    const memberIds = members.map(m => Number(m.id))

    const options = users.map(user => {
      const name = `${user.firstName} ${user.lastName}`
      const initials =
        name !== '' ? (name.match(/\b(\w)/g) || []).join('') : ''
      return {
        value: user.userId,
        label: name,
        school: user.school,
        grade: user.grade,
        avatar: user.profileImageUrl,
        initials,
        userId: Number(user.userId),
        firstName: user.firstName,
        lastName: user.lastName,
        relationship: user.relationship
      }
    }).filter(o => !memberIds.includes(o.value))
    return {
      options,
      hasMore: false
    }
  }, [userId, schoolId, members])

  const onSubmit = useCallback(async ({ selectedUsers }) => {
    setLoading(true)
    try{
      await addGroupMembers({
        chatId: channel.sid,
        users: selectedUsers.map(user => Number(user.userId))
      });

      selectedUsers.forEach(async user => {
        const messageAttributes = {
          firstName: user.firstName,
          lastName: user.lastName,
          imageKey: 'add_new_member'
        }

        await sendMessage({
          message: `${user.firstName} ${user.lastName} was added to the chat`,
          chatId: channel.sid,
          ...messageAttributes
        })

        logEvent({
          event: 'Chat- Send Message',
          props: { Content: 'Text', 'Channel SID': channel.sid }
        });
      });
    } finally {
      setLoading(false)
      handleCreateChannelClose()
    }
  }, [channel, handleCreateChannelClose])

  const handleEditGroup = useCallback(() => {
    handleEditGroupDetailsOpen()
    handleCloseGroupDetailMenu()
  }, [handleCloseGroupDetailMenu, handleEditGroupDetailsOpen])

  return (
    <div className={classes.header}>
      {channel && <Grid container justify='space-between'>
        <Typography className={classes.headerTitle}>
          <ChatIcon className={classes.headerIcon} /> {title}
        </Typography>
        <div className={classes.chatIcons}>
          {(otherUser?.registered || memberKeys.length > 2) &&
              videoEnabled &&
              <IconButton
                aria-label="study-room"
                className={classes.chatIcon}
                onClick={startVideo}
              >
                <ChatStudyRoom />
              </IconButton>}
          {!isCommunityChat && <IconButton
            aria-label="add-member"
            className={classes.chatIcon}
            onClick={handleCreateChannelOpen}
          >
            <ChatAddMember />
          </IconButton>}
          {isCommunityChat && temporaryAddMemberPermissionOfCommunityChat &&
            <IconButton
              aria-label="add-member"
              className={classes.chatIcon}
              onClick={handleCreateChannelOpen}
            >
              <ChatAddMember />
            </IconButton>}
          {Object.keys(members).length > 2 &&
          <IconButton
            aria-label="studyroom-members"
            className={classes.chatIcon}
            onClick={onOpenRightPanel}
          >
            {rightSpace
              ? <ChatActiveStudyRoomMemberrs />
              : <ChatStudyRoomMemberrs />
            }
          </IconButton>}
          <IconButton
            aria-label="group-details"
            className={classes.chatIcon}
            onClick={handleOpenGroupDetailMenu}
          >
            <MoreVertIcon />
          </IconButton>

          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleCloseGroupDetailMenu}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Paper className={classes.paper}>
              <MenuList>
                {Object.keys(members).length > 2 && isShow && (
                  <MenuItem onClick={handleEditGroup}>
                    Edit Group Details
                  </MenuItem>
                )}
                <MenuItem onClick={handleShareLink}>Share Link</MenuItem>
                <MenuItem className={classes.removeStudent}>
                  Remove Students
                </MenuItem>
              </MenuList>
            </Paper>
          </Popover>
        </div>
      </Grid>}
      <EditGroupDetailsDialog
        title='Edit Group Details'
        channel={channel}
        localChannel={local[channel.sid]}
        open={editGroupDetailsOpen}
        updateGroupName={handleUpdateGroupName}
        onClose={handleEditGroupDetailsClose}
      />
      <CreateChatChannelDialog
        title='ADD CLASSMATES'
        chatType={channelType}
        onClose={handleCreateChannelClose}
        onLoadOptions={handleLoadOptions}
        onSubmit={onSubmit}
        isLoading={loading}
        okLabel='Add Classmates'
      />
      {channel && <ShareLinkDialog
        open={openShareLink}
        isGroupChannel={local[channel.sid].members.length === 2}
        localChannel={local[channel.sid]}
        channelName={title}
        handleClose={closeShareLinkDialog}
      />}
    </div>
  )
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatHeader)