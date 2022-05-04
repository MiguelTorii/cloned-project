import React, { useEffect, useRef } from 'react';

import cx from 'clsx';
import { Link as RouterLink } from 'react-router-dom';

import ButtonBase from '@material-ui/core/ButtonBase';
import Link from '@material-ui/core/Link';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';

import { MEMBER_ROLES } from 'constants/app';
import { MESSAGE_PREVIEW_THRESHOLD_PX, PROFILE_PAGE_SOURCE } from 'constants/common';
import { getInitials, bytesToSize } from 'utils/chat';
import { buildPath } from 'utils/helpers';

import Avatar from 'components/Avatar';
import FileUpload from 'components/FileUpload/FileUploadContainer';
import RoleBadge from 'components/RoleBadge/RoleBadge';
import { useMessageMonitor } from 'contexts/MessageMonitorContext';
import useIntersection from 'hooks/useIntersection';

import useStyles from './ChatMessageStyles';

const MyLink = React.forwardRef<any, any>(({ href, ...props }, ref) => (
  <RouterLink to={href} {...props} ref={ref} />
));

type ChatMessageProps = {
  messageId: string;
  role?: string | null | undefined;
  userId?: string;
  name?: string;
  avatar?: string;
  isOwn?: boolean;
  messageList: Array<Record<string, any>>;
  isUserOnline?: any;
  onImageLoaded?: (...args: Array<any>) => any;
  onStartVideoCall?: (...args: Array<any>) => any;
  onImageClick?: (...args: Array<any>) => any;
};

const ChatMessage = ({
  messageId,
  onImageClick,
  onImageLoaded,
  onStartVideoCall,
  role,
  userId = '',
  name = '',
  avatar = '',
  isOwn = false,
  isUserOnline,
  messageList
}: ChatMessageProps) => {
  const rootRef = useRef();
  const classes = useStyles();
  const isInViewport = useIntersection(rootRef, MESSAGE_PREVIEW_THRESHOLD_PX);
  const { previewMessage } = useMessageMonitor();

  useEffect(() => {
    if (isInViewport) {
      previewMessage(messageId);
    }
  }, [messageId, isInViewport]);

  const linkify = (text: string) => {
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    return text.replace(
      urlRegex,
      (url) => `<a target="_blank" rel="noopener noreferrer" href="${url}">${url}</a>`
    );
  };

  const handleImageClick = (url) => () => {
    if (onImageClick) {
      onImageClick(url);
    }
  };

  const renderHtmlWithImage = (text) => {
    const htmlString = text.replaceAll(
      '<img',
      `<img
        onClick=window.clickImage(this)
        onLoad=window.loadImage()
        class=${classes.image}`
    );
    return linkify(htmlString);
  };

  const showMessages = (message, createdAt, isOwn, files) => {
    if (files?.length) {
      const fileHtml = files.map((file, index) => {
        const { readUrl, fileName, fileType } = file;

        if (fileType && fileType.includes('image')) {
          return (
            <div className={classes.bodyWrapper} key={readUrl}>
              <ButtonBase onClick={() => onImageClick(readUrl)}>
                <img className={classes.image} src={readUrl} alt="chat" onLoad={onImageLoaded} />
              </ButtonBase>
            </div>
          );
        }

        return (
          <FileUpload
            key={readUrl}
            name={file.fileName}
            size={bytesToSize(file.fileSize)}
            url={file.readUrl}
            smallChat
          />
        );
      });
      return (
        <>
          <div className={cx(classes.bodyWrapper)}>
            {message && (
              <Typography
                className={cx(classes.body, isOwn && classes.right, 'ql-editor')}
                dangerouslySetInnerHTML={{
                  __html: renderHtmlWithImage(message)
                }}
              />
            )}
            {fileHtml}
          </div>
          <Typography className={cx(classes.createdAt)} variant="caption">
            {createdAt}
          </Typography>
        </>
      );
    }

    return (
      <div className={cx(classes.bodyWrapper)}>
        <Typography
          className={cx(classes.body, isOwn && classes.right)}
          dangerouslySetInnerHTML={{
            __html: renderHtmlWithImage(message)
          }}
        />
        <Typography className={cx(classes.createdAt)} variant="caption">
          {createdAt}
        </Typography>
      </div>
    );
  };

  const renderItem = ({
    imageKey,
    body,
    isVideoNotification,
    firstName,
    lastName,
    files,
    createdAt,
    isOwn
  }: {
    imageKey: string;
    body: string;
    isVideoNotification: boolean;
    firstName: string;
    lastName: string;
    createdAt: string;
    files: object;
    isOwn: boolean;
  }) => {
    const message = body.replace(/(\r\n|\n|\r)/gm, '<br />');
    const dudUrl = '';

    if (imageKey !== '') {
      return (
        <div className={classes.bodyWrapper}>
          <ButtonBase onClick={handleImageClick(imageKey)}>
            <img className={classes.image} src={imageKey} alt="chat" onLoad={onImageLoaded} />
          </ButtonBase>
          <Typography className={classes.createdAt}>{createdAt}</Typography>
        </div>
      );
    }

    if (isVideoNotification && !isOwn) {
      return (
        <div className={classes.bodyWrapper}>
          <div className={classes.videoSpace}>
            <div className={classes.video}>
              <Typography
                className={classes.createdAt}
                style={{
                  fontStyle: 'italic'
                }}
                align="center"
              >
                {createdAt}
              </Typography>
              <Typography
                className={classes.videoTitle}
                align="center"
                style={{
                  fontStyle: 'italic'
                }}
              >
                {`${firstName} ${lastName} has invited you to a video call. `}
                <Link
                  href={dudUrl}
                  color="inherit"
                  className={classes.link}
                  onClick={onStartVideoCall}
                >
                  Join now!
                </Link>
              </Typography>
            </div>
          </div>
        </div>
      );
    }

    return showMessages(message, createdAt, isOwn, files);
  };

  const initials = getInitials(name);

  return (
    <ListItem
      ref={rootRef}
      alignItems="flex-start"
      className={cx(classes.root, isOwn && classes.justifyEnd)}
    >
      {!isOwn && (
        <ListItemAvatar
          className={classes.avatarLink}
          // eslint-disable-next-line
          // @ts-ignore
          component={MyLink}
          href={buildPath(`/profile/${userId}`, {
            from: PROFILE_PAGE_SOURCE.CHAT
          })}
        >
          <Avatar
            isOnline={isUserOnline}
            onlineBadgeBackground="circleIn.palette.feedBackground"
            profileImage={avatar}
            initials={initials}
            fromChat
          />
        </ListItemAvatar>
      )}
      <div className={cx(classes.content, isOwn && classes.alignEnd)}>
        {!isOwn && (
          <Typography variant="caption" className={classes.name}>
            <Link
              className={classes.link}
              component={MyLink}
              href={buildPath(`/profile/${userId}`, {
                from: PROFILE_PAGE_SOURCE.CHAT
              })}
            >
              {name}
            </Link>
            {role && role !== MEMBER_ROLES.STUDENT && <RoleBadge text={role} />}
          </Typography>
        )}
        {messageList.map((message) => (
          <div className={classes.message} key={message.sid}>
            {renderItem({
              imageKey: message.imageKey,
              body: message.body,
              isVideoNotification: message.isVideoNotification,
              firstName: message.firstName,
              lastName: message.lastName,
              createdAt: message.createdAt,
              files: message?.files,
              isOwn: Boolean(isOwn)
            })}
          </div>
        ))}
      </div>
    </ListItem>
  );
};

export default ChatMessage;
