// @flow
import React, { useCallback, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import ButtonBase from '@material-ui/core/ButtonBase';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import GroupIcon from '@material-ui/icons/Group';
import cx from 'classnames';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog, { dialogStyle } from 'components/Dialog';

const styles = theme => ({
  dialog: {
    ...dialogStyle,
    width: 500,
    zIndex: 2100
  },
  container: {
    position: 'relative'
  },
  hoverMenu: {
    position: 'absolute',
    bottom: 0,
    right: 10,
  },
  root: {
    display: 'flex',
    padding: theme.spacing(),
    width: '100%'
  },
  dark: {
    backgroundColor: theme.circleIn.palette.primaryBackground,
  },
  selected: {
    backgroundColor: theme.circleIn.palette.rowSelection,
  },
  progress: {
    display: 'flex',
    padding: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  grow: {
    flex: 1,
    paddingLeft: theme.spacing(),
    minWidth: 0,
    textAlign: 'left'
  },
  margin: {
    margin: theme.spacing(2)
  }
});

type Props = {
  classes: Object,
  isLoading: boolean,
  imageProfile: string,
  name: string,
  roomName: string,
  lastMessage: string,
  unReadCount: number,
  selected: boolean,
  dark: boolean,
  roomId: number,
  muted: boolean,
  handleRemoveChannel: Function,
  onClick: Function,
  handleMuteChannel: Function
};

const MainChatItem = ({
  classes,
  isLoading,
  imageProfile,
  name,
  roomName,
  lastMessage,
  roomId,
  unReadCount,
  handleRemoveChannel,
  handleMuteChannel,
  dark,
  selected,
  muted,
  onClick
}: Props) => {
  const [showMenu, setShowMenu] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

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

  const onMouseEnter = useCallback(() => setShowMenu(true), [])

  const onMouseLeave = useCallback(() => {
    setShowMenu(false)
    handleClose()
  }, [handleClose])

  const [removeChat, setRemoveChat] = useState(false)

  const handleRemoveClose = useCallback(() => setRemoveChat(false), [])
  const handleRemoveOpen = useCallback(() => {
    setRemoveChat(true)
    handleClose()
  }, [handleClose])

  const handleRemoveSubmit = useCallback(async () => {
    if (roomId) await handleRemoveChannel({ sid: roomId })
    handleRemoveClose()
  }, [handleRemoveChannel, roomId, handleRemoveClose])

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
        <Avatar src={imageProfile}>
          {initials !== '' ? initials : <GroupIcon />}
        </Avatar>
        <div className={classes.grow}>
          <Typography variant="subtitle1" noWrap>
            {roomName}
          </Typography>
          <Typography variant="body2" noWrap>
            {lastMessage}
          </Typography>
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
      {showMenu && <IconButton onClick={handleClick} className={classes.hoverMenu} size="small">
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
        <MenuItem onClick={handleMute}>{muted? 'Unmute' : 'Mute'}</MenuItem>
        <MenuItem onClick={handleRemoveOpen}>Leave</MenuItem>
      </Menu>
      <Dialog
        ariaDescribedBy="remove-dialog-description"
        className={classes.dialog}
        okTitle="Delete"
        onCancel={handleRemoveClose}
        onOk={handleRemoveSubmit}
        open={removeChat}
        showActions
        showCancel
        title="Delete Chat"
      >
        <Typography
          color="textPrimary"
          id="remove-dialog-description"
        >
            Are you sure you want to delete this chat?
          <br />
          <br />
            Deleting this chat can't be undone
        </Typography>
      </Dialog>
    </div>
  );
}


export default withStyles(styles)(MainChatItem);
