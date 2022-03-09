import React, { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Divider from '@material-ui/core/Divider';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Badge from '@material-ui/core/Badge';
import SettingsIcon from '@material-ui/icons/Settings';
import RemoveIcon from '@material-ui/icons/Remove';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import { ReactComponent as VideoCameraIcon } from '../../assets/svg/float_chat_camera.svg';
import { ReactComponent as ExpandChatIcon } from '../../assets/svg/float_chat_collapse.svg';
import { ReactComponent as CollapseChatIcon } from '../../assets/svg/float_chat_expand.svg';
import Dialog from '../Dialog/Dialog';
import styles from '../_styles/FloatingChat/ChatItem';
import { ChannelWrapper } from '../../reducers/chat';
import { Dispatch } from '../../types/store';
import { setCurrentChannelSidAction } from 'actions/chat';

type Props = {
  classes?: Record<string, any>;
  channels?: Array<any>;
  local?: Record<string, ChannelWrapper>;
  children?: React.ReactNode;
  title?: string;
  open?: boolean;
  unread?: number;
  expanded?: boolean;
  onOpen?: (...args: Array<any>) => any;
  onClose?: (...args: Array<any>) => any;
  onDelete?: (...args: Array<any>) => any;
  onStartVideoCall?: (...args: Array<any>) => any;
  onViewMembers?: (...args: Array<any>) => any;
  newChannel?: boolean;
  onExpand?: (...args: Array<any>) => any;
  push?: (...args: Array<any>) => any;
  setCurrentCommunityId?: any;
  channel?: any;
};

const ChatItem = ({
  classes,
  channels,
  local,
  children,
  title,
  open,
  unread,
  expanded,
  onOpen,
  onClose,
  onDelete,
  onStartVideoCall,
  onViewMembers,
  newChannel,
  onExpand,
  push,
  setCurrentCommunityId,
  channel
}: Props) => {
  const dispatch: Dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const [openRemove, setOpenRemove] = useState<boolean>(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRemoveClick = () => {
    handleClose();
    setOpenRemove(true);
  };

  const handleRemoveClose = () => {
    setOpenRemove(false);
  };

  const handleRemoveSubmit = async () => {
    setOpenRemove(false);
    const findAnotherDefaultChannel = channels.find((channelEntry) => channelEntry !== channel.sid);

    if (findAnotherDefaultChannel) {
      dispatch(setCurrentChannelSidAction(findAnotherDefaultChannel.sid));
    } else {
      dispatch(setCurrentChannelSidAction(null));
    }

    onDelete();
  };

  const handleViewMembers = () => {
    handleClose();
    onViewMembers();
  };

  const handleExpandChat = () => {
    onExpand();
    handleClose();
  };

  const handleGotoChat = async () => {
    setCurrentCommunityId('chat');
    dispatch(setCurrentChannelSidAction(channel.sid));
    push('/chat');
  };

  return (
    <>
      <div>
        <Paper
          className={cx(
            classes.paper,
            open && classes.paperOpen,
            open && expanded && classes.paperExpanded
          )}
          elevation={24}
        >
          <Badge color="secondary" badgeContent={unread}>
            <span />
          </Badge>
          <div className={cx(classes.header, unread && classes.notificationHeader)}>
            <ButtonBase className={classes.headerTitle} onClick={onOpen}>
              <Typography
                variant="h6"
                className={cx(classes.title, open && expanded && classes.titleExpanded)}
                noWrap
              >
                {!newChannel ? title : 'New Chat'}
              </Typography>
            </ButtonBase>
            {open ? (
              <>
                <ButtonBase className={classes.iconButton} onClick={onExpand}>
                  {expanded ? (
                    <ExpandChatIcon className={classes.expandIcon} />
                  ) : (
                    <CollapseChatIcon className={classes.expandIcon} />
                  )}
                </ButtonBase>
                {!newChannel && (
                  <ButtonBase className={classes.iconButton} onClick={onStartVideoCall}>
                    <VideoCameraIcon className={classes.icon} />
                  </ButtonBase>
                )}
                {!newChannel && (
                  <ButtonBase
                    className={classes.iconButton}
                    aria-owns={anchorEl ? 'simple-menu' : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                  >
                    <SettingsIcon className={cx(classes.icon, classes.settingIcon)} />
                  </ButtonBase>
                )}
                {!newChannel ? (
                  <ButtonBase className={classes.iconButton} onClick={onOpen}>
                    <RemoveIcon className={classes.icon} />
                  </ButtonBase>
                ) : (
                  <ButtonBase className={classes.iconButton} onClick={onClose}>
                    <ClearIcon className={classes.icon} />
                  </ButtonBase>
                )}
              </>
            ) : (
              <ButtonBase className={classes.iconButton} onClick={onClose}>
                <ClearIcon className={classes.icon} />
              </ButtonBase>
            )}
          </div>
          <div
            className={cx(
              !open && classes.hide,
              classes.content,
              expanded && classes.contentExpanded
            )}
          >
            <Divider />
            {children}
          </div>
        </Paper>
      </div>
      <Menu
        id="simple-menu"
        className={classes.menu}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleGotoChat}>Go to Chat</MenuItem>
        <MenuItem onClick={handleExpandChat}>{expanded ? 'Collapse Chat' : 'Expand Chat'}</MenuItem>
        <MenuItem onClick={handleViewMembers}>Members</MenuItem>
        {false && (
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
            Edit
          </MenuItem>
        )}
        <MenuItem className={classes.delete} onClick={handleRemoveClick}>
          Delete
        </MenuItem>
      </Menu>
      <Dialog
        ariaDescribedBy="remove-dialog-description"
        className={classes.dialog}
        okTitle="Delete"
        onCancel={handleRemoveClose}
        onOk={handleRemoveSubmit}
        open={openRemove}
        showActions
        showCancel
        title="Delete Chat"
      >
        <Typography color="textPrimary" id="remove-dialog-description">
          Are you sure you want to delete this chat?
          <br />
          <br />
          {"Deleting this chat can't be undone"}
        </Typography>
      </Dialog>
    </>
  );
};

export default withStyles(styles as any)(ChatItem);
