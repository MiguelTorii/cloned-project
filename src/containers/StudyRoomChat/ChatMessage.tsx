/* eslint-disable react/no-danger */
import React from 'react';

import cx from 'classnames';
import { Link as RouterLink } from 'react-router-dom';

import ButtonBase from '@material-ui/core/ButtonBase';
import Link from '@material-ui/core/Link';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { MEMBER_ROLES } from 'constants/app';
import { PROFILE_PAGE_SOURCE } from 'constants/common';
import { getInitials, bytesToSize } from 'utils/chat';
import { buildPath } from 'utils/helpers';

import Avatar from 'components/Avatar';
import FileUpload from 'components/FileUpload/FileUploadContainer';
import RoleBadge from 'components/RoleBadge/RoleBadge';

import { gutterStyle } from 'components/_styles/Gutter';

const MyLink = React.forwardRef<any, any>(({ href, ...props }, ref) => (
  <RouterLink to={href} {...props} ref={ref} />
));

const styles = (theme) => ({
  paper: { ...gutterStyle(theme), paddingTop: theme.spacing(2), paddingBottom: theme.spacing(2) },
  content: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing(),
    marginBottom: theme.spacing(),
    alignItems: 'flex-start',
    width: '70%'
  },
  justifyEnd: {
    justifyContent: 'flex-end'
  },
  alignEnd: {
    alignItems: 'flex-end'
  },
  name: {
    color: 'white',
    paddingLeft: 0
  },
  message: {
    maxWidth: '100%',
    marginBottom: theme.spacing(),
    display: 'flex',
    flexDirection: 'column'
  },
  bodyWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'column'
  },
  reverse: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  image: {
    borderRadius: 5,
    marginBottom: theme.spacing(),
    maxWidth: 120
  },
  createdAt: {
    paddingLeft: 0,
    color: theme.circleIn.palette.primaryText1
  },
  videoSpace: {
    height: 70,
    width: '100%'
  },
  video: {
    flex: 1,
    position: 'absolute',
    maxWidth: 250,
    width: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  videoTitle: {
    color: 'white'
  },
  videoSubTitle: {
    textAlign: 'center',
    color: 'white'
  },
  body: {
    flex: 1,
    borderRadius: 20,
    padding: '5px 20px 5px 20px',
    textAlign: 'left',
    backgroundColor: theme.circleIn.palette.hoverMenu,
    color: theme.circleIn.palette.secondaryText,
    wordWrap: 'break-word',
    width: '100%',
    '& a': {
      color: theme.circleIn.palette.brand
    }
  },
  right: {
    textAlign: 'right',
    backgroundColor: theme.circleIn.palette.hoverMenu,
    color: theme.circleIn.palette.secondaryText
  },
  avatarLink: {
    textDecoration: 'none',
    marginTop: 3
  },
  link: {
    color: theme.palette.primary.main
  }
});

type Props = {
  classes?: Record<string, any>;
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

class ChatMessageDate extends React.PureComponent<Props> {
  static defaultProps = {
    userId: '',
    name: '',
    avatar: '',
    isOwn: false
  };

  linkify = (text: string) => {
    // eslint-disable-next-line
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    return text.replace(
      urlRegex,
      (url) => `<a target="_blank" rel="noopener noreferrer" href="${url}">${url}</a>`
    );
  };

  handleImageClick = (url) => () => {
    const { onImageClick } = this.props;
    onImageClick(url);
  };

  renderHtmlWithImage = (text) => {
    const { classes } = this.props;
    const htmlString = text.replaceAll(
      '<img',
      `<img
        onClick=window.clickImage(this)
        onLoad=window.loadImage()
        class=${classes.image}`
    );
    return this.linkify(htmlString);
  };

  showMessages = (message, createdAt, isOwn, files) => {
    const { classes, onImageClick, onImageLoaded } = this.props;

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
                  __html: this.renderHtmlWithImage(message)
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
            __html: this.renderHtmlWithImage(message)
          }}
        />
        <Typography className={cx(classes.createdAt)} variant="caption">
          {createdAt}
        </Typography>
      </div>
    );
  };

  renderItem = ({
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
    const { classes, onImageLoaded, onStartVideoCall } = this.props;
    const message = body.replace(/(\r\n|\n|\r)/gm, '<br />');
    // eslint-disable-next-line no-script-url
    const dudUrl = '';

    if (imageKey !== '') {
      return (
        <div className={classes.bodyWrapper}>
          <ButtonBase onClick={this.handleImageClick(imageKey)}>
            <img
              className={classes.image}
              src={imageKey}
              alt="chat" // onClick={this.props.handleOpenChatImage(imageKey)}
              onLoad={onImageLoaded}
            />
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

    return this.showMessages(message, createdAt, isOwn, files);
  };

  render() {
    const { role, classes, userId, name, avatar, isOwn, isUserOnline, messageList } = this.props;
    const initials = getInitials(name);
    return (
      <ListItem alignItems="flex-start" className={cx(classes.root, isOwn && classes.justifyEnd)}>
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
              {this.renderItem({
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
  }
}

export default withStyles(styles as any)(ChatMessageDate);
