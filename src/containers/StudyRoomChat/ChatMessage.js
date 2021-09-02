/* eslint-disable react/no-danger */
// @flow
import React from 'react';
import cx from 'classnames';
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Link from '@material-ui/core/Link';
import OnlineBadge from 'components/OnlineBadge';
import RoleBadge from 'components/RoleBadge';
import FileUpload from 'components/FileUpload';
import { getInitials } from 'utils/chat';

const MyLink = React.forwardRef(({ href, ...props }, ref) => (
  <RouterLink to={href} {...props} ref={ref} />
));

const styles = (theme) => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
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
    // borderRadius: 20,
    // padding: '5px 10px 5px 10px',
    // backgroundColor: 'grey',
    // wordWrap: 'break-word',
    // minWidth: 270,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
    // marginLeft: -55
    // cursor: 'pointer'
  },
  videoTitle: {
    // textAlign: 'center',
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
    // 'word-break': 'break-all'
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
  classes: Object,
  role: ?string,
  userId?: string,
  name?: string,
  avatar?: string,
  isOwn?: boolean,
  messageList: Array<Object>,
  onImageLoaded: Function,
  onStartVideoCall: Function,
  onImageClick: Function
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
    const urlRegex =
      /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    return text.replace(
      urlRegex,
      (url) =>
        `<a target="_blank" rel="noopener noreferrer" href="${url}">${url}</a>`
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

  showMessages = (message, createdAt, isOwn) => {
    const { classes } = this.props;
    const splitHtmlStringByFiles = message.split('File Attachment');

    if (splitHtmlStringByFiles.length > 1) {
      const files = JSON.parse(
        splitHtmlStringByFiles[splitHtmlStringByFiles.length - 1]
      );
      const fileHtml = files.map((file) => (
        <FileUpload smallChat file={file} />
      ));

      let html = '';
      splitHtmlStringByFiles.forEach((splitHtmlString, key) => {
        if (key < splitHtmlStringByFiles.length - 1) {
          html += splitHtmlString;
        }
      });

      return (
        <>
          <div className={cx(classes.bodyWrapper)}>
            {splitHtmlStringByFiles[0] ? (
              <Typography
                className={cx(
                  classes.body,
                  isOwn && classes.right,
                  'ql-editor'
                )}
                dangerouslySetInnerHTML={{
                  __html: this.renderHtmlWithImage(html)
                }}
              />
            ) : null}
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
    createdAt,
    isOwn
  }: {
    imageKey: string,
    body: string,
    isVideoNotification: boolean,
    firstName: string,
    lastName: string,
    createdAt: string,
    isOwn: boolean
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
              alt="chat"
              // onClick={this.props.handleOpenChatImage(imageKey)}
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
                style={{ fontStyle: 'italic' }}
                align="center"
              >
                {createdAt}
              </Typography>
              <Typography
                className={classes.videoTitle}
                align="center"
                style={{ fontStyle: 'italic' }}
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

    return this.showMessages(message, createdAt, isOwn);
  };

  render() {
    const {
      role,
      classes,
      userId,
      name,
      avatar,
      isOwn,
      isUserOnline,
      messageList
    } = this.props;
    const initials = getInitials(name);

    return (
      <ListItem
        alignItems="flex-start"
        className={cx(classes.root, isOwn && classes.justifyEnd)}
      >
        {!isOwn && (
          <ListItemAvatar
            className={classes.avatarLink}
            component={MyLink}
            href={`/profile/${userId || ''}`}
          >
            <OnlineBadge
              isOnline={isUserOnline}
              bgColorPath="circleIn.palette.feedBackground"
            >
              <Avatar alt={name} src={avatar}>
                {initials}
              </Avatar>
            </OnlineBadge>
          </ListItemAvatar>
        )}
        <div className={cx(classes.content, isOwn && classes.alignEnd)}>
          {!isOwn && (
            <Typography variant="caption" className={classes.name}>
              <Link
                className={classes.link}
                component={MyLink}
                href={`/profile/${userId || ''}`}
              >
                {name}
              </Link>
              {role && <RoleBadge text={role} />}
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
                isOwn: Boolean(isOwn)
              })}
            </div>
          ))}
        </div>
      </ListItem>
    );
  }
}

export default withStyles(styles)(ChatMessageDate);
