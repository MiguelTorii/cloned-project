import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import clsx from 'clsx';
import { Emoji, Picker } from 'emoji-mart';
import parse from 'html-react-parser';
import update from 'immutability-helper';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Link from '@material-ui/core/Link';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Popover from '@material-ui/core/Popover';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import MoreVerticalIcon from '@material-ui/icons/MoreVert';

import {
  DEFAULT_EMOJI_REACTIONS,
  MESSAGE_PREVIEW_THRESHOLD_PX,
  PROFILE_PAGE_SOURCE
} from 'constants/common';
import { buildPath } from 'utils/helpers';

import { showNotification } from 'actions/notifications';
import { apiDeleteMessage, editMessage, apiAddChatReaction, apiRemoveChatReaction } from 'api/chat';
import { ReactComponent as IconAddReaction } from 'assets/svg/add_reaction.svg';
import { ReactComponent as Camera } from 'assets/svg/camera-join-room.svg';
import Avatar from 'components/Avatar';
import { useDeleteModal } from 'contexts/DeleteModalContext';
import { useMessageMonitor } from 'contexts/MessageMonitorContext';
import useHotKey, { HOTKEYS } from 'hooks/useHotKey';
import useIntersection from 'hooks/useIntersection';
import { useAppSelector } from 'redux/store';

import useStyles from '../_styles/FloatingChat/CommunityChatMessage';
import AnyFileUpload from '../AnyFileUpload/AnyFileUpload';
import EditFailedModal from '../EditFailedModal/EditFailedModal';

import ChatReactions from './ChatReactions';
import MessageQuill from './EditMessageQuill';
import ReactedUsersModal from './ReactedUsersModal';

import type { ChatMessageItem, ChatReactionsData } from 'types/models';

const MyLink = React.forwardRef<any, any>(({ href, disabled, ...props }, ref) =>
  !disabled ? <RouterLink to={href} {...props} ref={ref} /> : <span {...props} />
);

type Props = {
  message: ChatMessageItem;
  name: string;
  authorUserId: string;
  channelId: string;
  avatar: string;
  isOnline: boolean;
  isGroupChannel: boolean;
  date: string;
  isLastMessage: boolean;
  onViewProfile: (number) => void;
  onReportIssue: () => void;
  onBlockMember: (number, string) => void;
  onImageClick: (string) => void;
  onImageLoaded: (string) => void;
  onStartVideoCall: () => void;
  onRemoveMessage: (messageId: string) => void;
  reduced?: boolean;
};

const linkify = (text) => {
  const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.]*[-A-Z0-9+&@#\/%=~_|])/gi;
  return text.replace(urlRegex, (url) => {
    const urlIndex = text.indexOf(url);

    if (text.substr(urlIndex - 5, urlIndex - 1).indexOf('src') === -1) {
      return `<a target="_blank" rel="noopener noreferrer" href="${url}">${url}</a>`;
    }

    return url;
  });
};

const EMOJI_ICON_SIZE = 20;

const CommunityChatMessageItem = ({
  date,
  message,
  channelId,
  name,
  authorUserId,
  avatar,
  isOnline,
  isGroupChannel,
  isLastMessage,
  onViewProfile,
  onReportIssue,
  onBlockMember,
  onImageClick,
  onImageLoaded,
  onStartVideoCall,
  reduced = false
}: Props) => {
  const rootRef = useRef();
  const classes = useStyles();
  const dispatch = useDispatch();
  const isInViewport = useIntersection(rootRef, MESSAGE_PREVIEW_THRESHOLD_PX);
  const { previewMessage } = useMessageMonitor();

  const { open: openDeleteModal } = useDeleteModal();
  const myUserId = useAppSelector((state) => state.user.data.userId);
  const [isHover, setIsHover] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [showError, setShowError] = useState(false);
  const [value, setValue] = useState('');
  const [editMessageId, setEditMessageId] = useState('');
  const [files, setFiles] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [emojiPopupAnchorEl, setEmojiPopupAnchorEl] = useState(null);
  const [emojiReactions, setEmojiReactions] = useState<ChatReactionsData>([]);
  const [reactedUsersModalOpen, setReactedUsersModalOpen] = useState(false);

  const myUserIdNumber = useMemo(() => parseInt(myUserId, 10), [myUserId]);

  useEffect(() => {
    if (isInViewport) {
      previewMessage(message.sid);
    }
  }, [message, isInViewport]);

  const handleMouseEnter = useCallback(() => {
    setIsHover(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHover(false);
    setAnchorEl(null);
    setEmojiPopupAnchorEl(null);
  }, []);

  const handleOpenThreeDotsMenu = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleCloseThreeDotsMenu = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleViewProfile = useCallback(() => {
    onViewProfile(authorUserId);
  }, [authorUserId, onViewProfile]);

  const handleReportIssue = useCallback(() => {
    onReportIssue();
  }, [onReportIssue]);

  const handleOpenBlockMemberModal = useCallback(() => {
    onBlockMember(authorUserId, name);
  }, [onBlockMember, authorUserId, name]);

  const handleAddEmojiReaction = useCallback(
    (emojiColon) => {
      apiAddChatReaction(channelId, message.sid, emojiColon).then(() => {
        const emojiIndex = emojiReactions.findIndex(
          (reaction) => reaction.reaction_type === emojiColon
        );

        if (emojiIndex >= 0) {
          setEmojiReactions(
            update(emojiReactions, {
              [emojiIndex]: {
                user_ids: { $push: [myUserIdNumber] }
              }
            })
          );
        } else {
          setEmojiReactions(
            update(emojiReactions, {
              $push: [
                {
                  reaction_type: emojiColon,
                  user_ids: [myUserIdNumber]
                }
              ]
            })
          );
        }
      });
    },
    [myUserIdNumber, emojiReactions, channelId, message.sid]
  );

  const handleRemoveEmojiReaction = useCallback(
    (emojiColon) => {
      apiRemoveChatReaction(channelId, message.sid, emojiColon).then(() => {
        const newEmojiReactions = [...emojiReactions];

        newEmojiReactions.forEach((reaction) => {
          if (!reaction.reaction_type.startsWith(emojiColon)) {
            return;
          }
          const userIndex = reaction.user_ids.findIndex((userId) => userId === myUserIdNumber);
          if (userIndex >= 0) {
            reaction.user_ids.splice(userIndex, 1);
          }
        });

        setEmojiReactions(newEmojiReactions.filter((reaction) => reaction.user_ids.length > 0));
      });
    },
    [myUserIdNumber, emojiReactions, channelId, message.sid]
  );

  const handleSelectEmojiReaction = useCallback(
    (emojiColon) => {
      const emojiIndex = emojiReactions.findIndex(
        (reactionData) => reactionData.reaction_type === emojiColon
      );

      // Check if already reacted with the emoji
      if (emojiIndex >= 0 && emojiReactions[emojiIndex].user_ids.includes(myUserIdNumber)) {
        handleRemoveEmojiReaction(emojiColon);
      } else {
        handleAddEmojiReaction(emojiColon);
      }
    },
    [emojiReactions, myUserIdNumber, handleAddEmojiReaction, handleRemoveEmojiReaction]
  );

  const handleOpenEmojiPopup = useCallback((event) => {
    setEmojiPopupAnchorEl(event.currentTarget);
  }, []);

  const handleSelectEmoji = useCallback(
    (emojiData) => {
      handleSelectEmojiReaction(emojiData.colons);
      setEmojiPopupAnchorEl(null);
    },
    [handleSelectEmojiReaction]
  );

  const handleCloseEmojiPopup = useCallback(() => setEmojiPopupAnchorEl(null), []);

  const handleEdit = useCallback(
    (msgId, body) => {
      const messageBody = body.replace(/(\r\n|\n|\r)/gm, '<br />');
      setEdit(true);
      if (msgId !== editMessageId) {
        setValue(messageBody);
        setEditMessageId(msgId);
      }
      setAnchorEl(null);
    },
    [editMessageId]
  );

  // handle what happens on arrow up key press
  const handleKeyPressEditMessage = useCallback(() => {
    if (
      myUserId === authorUserId &&
      message.body &&
      !message.isVideoNotification &&
      isLastMessage
    ) {
      handleEdit(message.sid, message.body);
    }
  }, [
    authorUserId,
    handleEdit,
    isLastMessage,
    message.body,
    message.isVideoNotification,
    message.sid,
    myUserId
  ]);

  useHotKey([HOTKEYS.EDIT_MESSAGE.key], handleKeyPressEditMessage);

  const handleDeleteMessage = useCallback(
    (msgId) => {
      setAnchorEl(null);
      openDeleteModal(
        'Delete this chat message?',
        'Are you sure you want to delete what you wrote? This action cannot be undone.',
        () => {
          apiDeleteMessage(channelId, msgId);
        }
      );
    },
    [channelId, openDeleteModal]
  );

  const handleSaveMessage = useCallback(
    async (messageBody) => {
      try {
        await editMessage({
          message: messageBody,
          messageId: editMessageId,
          chatId: channelId
        });
        dispatch(
          showNotification({
            message: 'Your message was successfully edited.',
            variant: 'info'
          })
        );
        setEdit(false);
      } catch (err) {
        setShowError(true);
      }
    },
    [editMessageId, channelId, dispatch, value]
  );

  const handleCloseErrorModal = useCallback(() => {
    setShowError(false);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEdit(false);
  }, []);

  const handleChangeMessage = useCallback((updatedValue) => {
    if (updatedValue.trim() === '<p><br></p>' || updatedValue.trim() === '<p>\n</p>') {
      setValue('');
    } else {
      const currentValue = updatedValue.replaceAll('<p><br></p>', '').replaceAll('<p>\n</p>', '');
      setValue(currentValue);
    }
  }, []);

  const renderHtmlWithImage = useCallback(
    (text) => {
      const htmlString = text.replaceAll(
        '<img',
        `<img
        onClick=window.clickImage(this)
        onLoad=window.loadImage()
        class=${classes.image}`
      );
      return linkify(htmlString);
    },
    [classes]
  );

  const messageBody = useMemo(() => {
    const { body, imageKey, isVideoNotification, firstName, files, sid } = message;
    const messageBody = body.replace(/(\r\n|\n|\r)/gm, '<br />');

    if (['add_new_member', 'remove_user'].includes(imageKey)) {
      return (
        <div className={classes.alertWrapper}>
          <Typography
            className={classes.alert}
            dangerouslySetInnerHTML={{
              __html: linkify(messageBody)
            }}
          />
        </div>
      );
    }

    if (sid === editMessageId && isEdit) {
      return (
        <>
          <MessageQuill
            isNamedChannel
            userId={myUserId}
            value={value}
            setValue={setValue}
            files={files}
            setFiles={setFiles}
            onSendMessage={handleSaveMessage}
            onChange={handleChangeMessage}
          />
          <Box mt={1}>
            <Button onClick={() => handleCancelEdit()}>Cancel</Button>
            <Button
              classes={{
                root: classes.saveEditMessageButton,
                disabled: classes.disableBtn
              }}
              disabled={!value}
              onClick={() => handleSaveMessage(value)}
            >
              Save changes
            </Button>
          </Box>
        </>
      );
    }

    if (sid === editMessageId && messageBody !== value) {
      return (
        <div className={classes.bodyWrapper}>
          <Typography className={clsx(classes.bodyEditMessage, 'ql-editor')}>
            {parse(value)}
            <span className={classes.editedMessage}> (edited) </span>
          </Typography>
          <AnyFileUpload
            files={files}
            onImageClick={onImageClick}
            onImageLoaded={onImageLoaded}
            renderHtmlWithImage={renderHtmlWithImage}
          />
        </div>
      );
    }

    if (imageKey !== '') {
      return (
        <div className={classes.bodyWrapper}>
          <ButtonBase onClick={() => onImageClick(imageKey)}>
            <img className={classes.image} src={imageKey} alt="chat" onLoad={onImageLoaded} />
          </ButtonBase>
        </div>
      );
    }

    if (!reduced && isVideoNotification) {
      return (
        <div className={classes.bodyWrapper}>
          <Card className={classes.videoAlertRoot}>
            <CardContent
              classes={{
                root: classes.cardContent
              }}
            >
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                <b>{firstName}</b> started a Study Room 🎉
              </Typography>
              <Avatar profileImage={avatar} fullName={name} fromChat />
            </CardContent>
            <CardActions
              classes={{
                root: classes.cardActions
              }}
            >
              <Button className={classes.join} onClick={onStartVideoCall}>
                <Camera className={classes.camera} /> Join Now
              </Button>
            </CardActions>
          </Card>
        </div>
      );
    }

    return (
      <AnyFileUpload
        files={files}
        message={messageBody}
        onImageClick={onImageClick}
        onImageLoaded={onImageLoaded}
        renderHtmlWithImage={renderHtmlWithImage}
      />
    );
  }, [
    message,
    name,
    isEdit,
    value,
    editMessageId,
    onImageClick,
    onImageLoaded,
    onStartVideoCall,
    onViewProfile,
    renderHtmlWithImage
  ]);

  const handleCloseReactedUserModal = useCallback(() => {
    setReactedUsersModalOpen(false);
  }, []);

  const handleOpenReactedUserModal = useCallback(() => {
    setReactedUsersModalOpen(true);
    setAnchorEl(null);
  }, []);

  useEffect(() => {
    setEmojiReactions(message.reactions || []);
  }, [message]);

  return (
    <ListItem
      ref={rootRef}
      key={message.sid}
      alignItems="flex-start"
      className={clsx(classes.root, isHover && 'hover')}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={classes.content}>
        {message.imageKey !== 'add_new_member' && (
          <ListItemAvatar
            className={classes.avatarLink}
            // eslint-disable-next-line
            // @ts-ignore
            component={!reduced ? MyLink : 'span'}
            href={buildPath(`/profile/${authorUserId}`, {
              from: PROFILE_PAGE_SOURCE.CHAT
            })}
          >
            <Avatar
              isOnline={isOnline}
              onlineBadgeBackground="circleIn.palette.feedBackground"
              profileImage={avatar}
              fullName={name}
              fromChat
            />
          </ListItemAvatar>
        )}
      </div>
      <div className={classes.message}>
        {message.imageKey !== 'add_new_member' && (
          <Box>
            <Box display="flex" alignItems="center">
              <Typography variant="subtitle2" className={classes.name}>
                {reduced ? (
                  <span>{name}</span>
                ) : (
                  <Link
                    className={classes.link}
                    component={MyLink}
                    href={buildPath(`/profile/${authorUserId}`, {
                      from: PROFILE_PAGE_SOURCE.CHAT
                    })}
                  >
                    {name}
                  </Link>
                )}
              </Typography>
              <Typography className={classes.createdAt} variant="caption">
                {date} at {message.createdAt}
              </Typography>
            </Box>
            {isHover && (
              <Box className={classes.chatItemHoverMenu} hidden={!isHover}>
                {DEFAULT_EMOJI_REACTIONS.map((emoji) => (
                  <Button
                    key={emoji}
                    className={classes.hoverMenuItem}
                    onClick={() => handleSelectEmojiReaction(emoji)}
                  >
                    <Emoji emoji={emoji} size={EMOJI_ICON_SIZE} />
                  </Button>
                ))}
                <Button className={classes.hoverMenuItem} onClick={handleOpenEmojiPopup}>
                  <IconAddReaction />
                </Button>
                {!reduced && (
                  <Button className={classes.hoverMenuItem} onClick={handleOpenThreeDotsMenu}>
                    <MoreVerticalIcon />
                  </Button>
                )}
              </Box>
            )}
            <Popover
              open={Boolean(emojiPopupAnchorEl) && isHover}
              anchorEl={emojiPopupAnchorEl}
              onClose={handleCloseEmojiPopup}
            >
              <Picker onSelect={handleSelectEmoji} />
            </Popover>
            <Popover
              open={Boolean(anchorEl) && isHover}
              anchorEl={anchorEl}
              onClose={handleCloseThreeDotsMenu}
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
              <MenuList className={classes.userMenu}>
                <MenuItem onClick={handleViewProfile}>
                  <Typography variant="inherit">View Profile</Typography>
                </MenuItem>
                <MenuItem onClick={handleOpenReactedUserModal}>
                  <Typography variant="inherit">Who reacted?</Typography>
                </MenuItem>
                {isGroupChannel && (
                  <MenuItem onClick={handleOpenBlockMemberModal}>
                    <Typography variant="inherit">Block Member</Typography>
                  </MenuItem>
                )}
                {myUserId === authorUserId && message.body && !message.isVideoNotification && (
                  <MenuItem onClick={() => handleEdit(message.sid, message.body)}>
                    <Typography variant="inherit">Edit</Typography>
                  </MenuItem>
                )}
                {myUserId === authorUserId && message.body && !message.isVideoNotification && (
                  <MenuItem onClick={() => handleDeleteMessage(message.sid)}>
                    <Typography variant="inherit" className={classes.colorRed}>
                      Delete Message
                    </Typography>
                  </MenuItem>
                )}
                <MenuItem onClick={handleReportIssue}>
                  <Typography variant="inherit" className={classes.colorRed} noWrap>
                    Report Issue
                  </Typography>
                </MenuItem>
              </MenuList>
            </Popover>
          </Box>
        )}
        {messageBody}
        <EditFailedModal onOk={handleCloseErrorModal} open={showError} />
        <ChatReactions
          data={emojiReactions}
          onAddEmoji={handleAddEmojiReaction}
          onRemoveEmoji={handleRemoveEmojiReaction}
          onSelectEmoji={handleSelectEmojiReaction}
        />
      </div>

      <ReactedUsersModal
        messageSid={message.sid}
        open={reactedUsersModalOpen}
        onClose={handleCloseReactedUserModal}
        onRemoveReaction={handleRemoveEmojiReaction}
      />
    </ListItem>
  );
};

export default CommunityChatMessageItem;
