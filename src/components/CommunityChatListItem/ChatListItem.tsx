import { useCallback, useEffect, useState, useMemo } from 'react';

import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';

import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import { PERMISSIONS } from 'constants/common';
import { parseChannelMetadata } from 'utils/chat';

import Dialog from 'components/Dialog';
import EditGroupDetailsDialog from 'containers/Chat/EditGroupDetailsDialog';
import ErrorBoundary from 'containers/ErrorBoundary/ErrorBoundary';
import {
  useSelectChannelById,
  useChannelMetadataById,
  useUnreadById,
  getChannelUnreadCount,
  UNREAD_COUNT_QUERY_KEY,
  setChannelRead
} from 'features/chat';
import { useAppSelector } from 'redux/store';

import useStyles from './_styles/mainChatItem';
import BaseChatItem from './BaseChatItem';

type Props = {
  channelId: string;
  onOpenChannel?: (sid: string) => void;
  selected?: boolean;
  handleRemoveChannel?: (sid: string) => void;
  handleMuteChannel?: ({ sid }: { sid: string }) => void;
  handleUpdateGroupName?: (sid: string) => void;
  dark?: boolean;
};

const ChatListItem = ({
  channelId,
  dark,
  handleMuteChannel,
  selected,
  onOpenChannel,
  handleRemoveChannel,
  handleUpdateGroupName
}: Props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [showMenu, setShowMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editGroupDetailsOpen, setEditGroupDetailsOpen] = useState(false);

  const userId = useAppSelector((state) => state.user.data.userId);
  const permission = useAppSelector((state) => state.user.data.permission);

  const { data: channel, isLoading: isLocalChannelLoading } = useSelectChannelById(channelId);
  const { data: channelMetadata, isLoading: isChannelLoading } = useChannelMetadataById(channelId);

  // Reuse the global unread cache rather than fetch for every channel
  const { data: unreadCount, isFetched, isIdle } = useUnreadById(channelId);

  useEffect(() => {
    const fetchUnreadCountById = async () => {
      await queryClient.fetchQuery([UNREAD_COUNT_QUERY_KEY, channelId], () =>
        getChannelUnreadCount(channel)
      );
    };

    if (isIdle && channel && isFetched && unreadCount === undefined) {
      fetchUnreadCountById();
    }
  }, [channel, channelId, isFetched, isIdle, queryClient, unreadCount]);

  const { isDirectChat, userLength, isGroupChat, name, isOnline, thumbnail } = useMemo(
    () => parseChannelMetadata(userId, channelMetadata),
    [channelMetadata, userId]
  );

  const handleOpenChannel = () => {
    if (!channel) {
      return;
    }
    onOpenChannel?.(channelId);
  };

  const isShow =
    permission &&
    permission.includes(PERMISSIONS.EDIT_GROUP_PHOTO_ACCESS) &&
    permission.includes(PERMISSIONS.RENAME_GROUP_CHAT_ACCESS);

  const handleEditGroupDetailsClose = useCallback(() => setEditGroupDetailsOpen(false), []);
  const handleEditGroupDetailsOpen = useCallback(() => setEditGroupDetailsOpen(true), []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMute = () => {
    if (!channel) {
      return;
    }
    handleMuteChannel?.({
      sid: channel.sid
    });
    handleClose();
  };

  const onMouseEnter = () => {
    if (handleRemoveChannel && handleMuteChannel) {
      setShowMenu(true);
    }
  };

  const onMouseLeave = () => {
    setShowMenu(false);
    handleClose();
  };

  const [removeChat, setRemoveChat] = useState(false);

  const handleRemoveClose = useCallback(() => setRemoveChat(false), []);

  const handleRemoveOpen = () => {
    setRemoveChat(true);
    handleClose();
  };

  const handleRemoveSubmit = async () => {
    if (channel?.sid) {
      await handleRemoveChannel?.(channel.sid);
    }

    handleRemoveClose();
  };

  const handleEditGroup = async () => {
    handleEditGroupDetailsOpen();
    handleClose();
  };

  if (isLocalChannelLoading || isChannelLoading) {
    return (
      <div className={classes.progress}>
        <CircularProgress size={20} color="secondary" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={classes.container}>
        <BaseChatItem
          isDirectChat={isDirectChat}
          isOnline={isOnline}
          imageProfile={thumbnail}
          name={name}
          roomName={channelMetadata?.groupName}
          unReadCount={unreadCount}
          selected={selected}
          dark={dark}
          muted={channelMetadata?.isMuted}
          memberLength={userLength}
          onClick={handleOpenChannel}
        />
        {showMenu && (
          <IconButton onClick={handleClick} className={classes.hoverMenu} size="small">
            <MoreHorizIcon fontSize="inherit" />
          </IconButton>
        )}
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          getContentAnchorEl={null}
          onClose={handleClose}
        >
          <MenuItem onClick={() => setChannelRead(queryClient, channel)}>Mark as Read</MenuItem>
          {isGroupChat && isShow && <MenuItem onClick={handleEditGroup}>Edit Group</MenuItem>}
          <MenuItem onClick={handleMute}>
            {channelMetadata?.isMuted ? 'Unmute Group' : 'Mute Group'}
          </MenuItem>
          <MenuItem className={classes.leaveGroup} onClick={handleRemoveOpen}>
            Leave Group
          </MenuItem>
        </Menu>
        {/* TODO Not currently showing, no way of setting editGroupDetailsOpen as true */}
        {channelMetadata && channel && (
          <EditGroupDetailsDialog
            title="Group Details"
            metadata={channelMetadata}
            channel={channel}
            open={editGroupDetailsOpen}
            updateGroupName={handleUpdateGroupName}
            onClose={handleEditGroupDetailsClose}
          />
        )}
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
          <Typography color="textPrimary" id="remove-dialog-description">
            Are you sure you want to leave this chat group?
            <br />
            If you leave, this chat group will be deleted from your Direct Messages.
          </Typography>
        </Dialog>
      </div>
    </ErrorBoundary>
  );
};

export default ChatListItem;
