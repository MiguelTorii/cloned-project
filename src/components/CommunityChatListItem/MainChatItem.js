// @flow
import React, { useCallback, useState, useMemo } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import ButtonBase from '@material-ui/core/ButtonBase'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import Badge from '@material-ui/core/Badge'
import GroupIcon from '@material-ui/icons/Group'
import cx from 'classnames'
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import EditGroupDetailsDialog from 'containers/Chat/EditGroupDetailsDialog'
import Dialog from 'components/Dialog'
import OnlineBadge from 'components/OnlineBadge'
import { PERMISSIONS } from 'constants/common'
import useStyles from './_styles/mainChatItem'

type Props = {
  isLoading: boolean,
  isDirectChat: boolean,
  isOnline: boolean,
  imageProfile: string,
  name: string,
  roomName: string,
  unReadCount: number,
  selected: boolean,
  dark: boolean,
  roomId: number,
  muted: boolean,
  members: Array,
  permission: Array,
  local: Array,
  targetChannel: Object,
  handleUpdateGroupName: Function,
  handleRemoveChannel: Function,
  onClick: Function,
  handleMuteChannel: Function,
  handleMarkAsRead: Function
};

const MainChatItem = ({
  name = '',
  isLoading,
  isDirectChat,
  isOnline,
  imageProfile,
  roomName,
  roomId,
  unReadCount,
  permission,
  targetChannel,
  handleUpdateGroupName,
  handleRemoveChannel,
  handleMuteChannel,
  handleMarkAsRead,
  dark,
  selected,
  muted,
  local,
  members,
  onClick
}: Props) => {
  const classes = useStyles()

  const [showMenu, setShowMenu] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [editGroupDetailsOpen, setEditGroupDetailsOpen] = useState(false)

  const isShow = useMemo(() => permission &&
    permission.includes(PERMISSIONS.EDIT_GROUP_PHOTO_ACCESS) &&
    permission.includes(PERMISSIONS.RENAME_GROUP_CHAT_ACCESS), [permission])

  const handleEditGroupDetailsClose = useCallback(() => setEditGroupDetailsOpen(false), [])
  const handleEditGroupDetailsOpen = useCallback(() => setEditGroupDetailsOpen(true), [])

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [])

  const handleMute = useCallback(() => {
    handleMuteChannel({ sid: roomId })
    handleClose()
  }, [roomId, handleMuteChannel, handleClose])

  const initials = useCallback(name !== '' ? (name.match(/\b(\w)/g) || []).join('') : '', [name]);

  const onMouseEnter = useCallback(() => {
    if(handleRemoveChannel && handleMuteChannel) setShowMenu(true)
  }, [handleMuteChannel, handleRemoveChannel])

  const onMouseLeave = useCallback(() => {
    setShowMenu(false)
    handleClose()
  }, [handleClose])

  const [removeChat, setRemoveChat] = useState(false)

  const handleRead = useCallback(() => {
    handleMarkAsRead(targetChannel)
    handleClose()
  }, [handleClose, handleMarkAsRead, targetChannel])

  const handleRemoveClose = useCallback(() => setRemoveChat(false), [])
  const handleRemoveOpen = useCallback(() => {
    setRemoveChat(true)
    handleClose()
  }, [handleClose])

  const handleRemoveSubmit = useCallback(async () => {
    if (roomId) await handleRemoveChannel({ sid: roomId })
    handleRemoveClose()
  }, [handleRemoveChannel, roomId, handleRemoveClose])

  const handleEditGroup = useCallback(async () => {
    handleEditGroupDetailsOpen(true)
    handleClose()
  }, [handleClose, handleEditGroupDetailsOpen])

  if (isLoading)
    return (
      <div className={classes.progress}>
        <CircularProgress size={20} color="secondary" />
      </div>
    );

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={classes.container}
    >
      <ButtonBase
        className={cx(classes.root, {
          [classes.dark]: dark,
          [classes.selected] : selected
        })}
        onClick={onClick}
      >
        <OnlineBadge
          isVisible={isDirectChat}
          isOnline={isOnline}
          bgColorPath={dark
            ? "circleIn.palette.feedBackground"
            : "circleIn.palette.appBar"}
        >
          <Avatar className={classes.avatarProfile} src={imageProfile}>
            {initials || <GroupIcon />}
          </Avatar>
        </OnlineBadge>
        <div className={classes.grow}>
          <Typography className={classes.roomName} variant="subtitle1" noWrap>
            {roomName}
          </Typography>
          {members && members.length > 2 &&
            <Typography
              className={classes.groupMemberCount}
              variant="subtitle1"
              noWrap
            >
              {members.length} members
            </Typography>}
        </div>
        {muted && <NotificationsOffIcon />}
        <Badge
          className={classes.margin}
          badgeContent={unReadCount}
          color="secondary"
        >
          <span />
        </Badge>
      </ButtonBase>
      {showMenu && <IconButton
        onClick={handleClick}
        className={classes.hoverMenu}
        size="small"
      >
        <MoreHorizIcon fontSize="inherit" />
      </IconButton>}
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        getContentAnchorEl={null}
        onClose={handleClose}
      >
        <MenuItem onClick={handleRead}>Mark as Read</MenuItem>
        {members && members.length > 2 && isShow &&
          <MenuItem onClick={handleEditGroup}>
          Edit Group
          </MenuItem>}
        <MenuItem onClick={handleMute}>
          {muted? 'Unmute Group' : 'Mute Group'}
        </MenuItem>
        <MenuItem
          className={classes.leaveGroup}
          onClick={handleRemoveOpen}
        >
          Leave Group
        </MenuItem>
      </Menu>
      {targetChannel && <EditGroupDetailsDialog
        title='Group Details'
        channel={targetChannel}
        localChannel={local[targetChannel.sid]}
        open={editGroupDetailsOpen}
        updateGroupName={handleUpdateGroupName}
        onClose={handleEditGroupDetailsClose}
      />}
      <Dialog
        ariaDescribedBy="remove-dialog-description"
        className={classes.dialog}
        okTitle="Leave"
        onCancel={handleRemoveClose}
        onOk={handleRemoveSubmit}
        open={removeChat}
        showActions
        showCancel
        title="Leave Group"
      >
        <Typography
          color="textPrimary"
          id="remove-dialog-description"
        >
          Are you sure you want to leave this chat group?
          <br />
          If you leave, this chat group will be deleted from your Direct Messages.
        </Typography>
      </Dialog>
    </div>
  );
}


export default MainChatItem;
