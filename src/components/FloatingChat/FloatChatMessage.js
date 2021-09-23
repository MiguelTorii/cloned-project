/* eslint-disable react/no-danger */
// @flow
import React, { useEffect, useCallback } from 'react';
import { withRouter } from 'react-router';
import cx from 'classnames';
import clsx from 'clsx';
import { Link as RouterLink } from 'react-router-dom';
// import parse from 'html-react-parser'
import ListItem from '@material-ui/core/ListItem';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Link from '@material-ui/core/Link';
import OnlineBadge from 'components/OnlineBadge/OnlineBadge';
import FileUpload from 'components/FileUpload/FileUploadContainer';
import AnyFileUpload from 'components/AnyFileUpload/AnyFileUpload';
import { ReactComponent as Camera } from 'assets/svg/camera-join-room.svg';
import { getInitials } from 'utils/chat';
import useStyles from '../_styles/FloatingChat/FloatChatMessage';

const MyLink = React.forwardRef(({ href, ...props }, ref) => (
  <RouterLink to={href} {...props} ref={ref} />
));

type Props = {
  userId: string,
  name: string,
  avatar: string,
  isOwn: boolean,
  isUserOnline: boolean,
  date: string,
  messageList: Array<Object>,
  onImageLoaded: Function,
  onStartVideoCall: Function,
  onImageClick: Function
};

const ChatMessage = ({
  userId,
  name,
  date,
  avatar,
  isOwn,
  isUserOnline,
  messageList,
  onImageLoaded,
  onStartVideoCall,
  onImageClick
}: Props) => {
  const classes = useStyles();

  const linkify = (text) => {
    // eslint-disable-next-line
    const urlRegex =
      /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.]*[-A-Z0-9+&@#\/%=~_|])/gi;
    return text.replace(urlRegex, (url) => {
      const urlIndex = text.indexOf(url);
      if (text.substr(urlIndex - 5, urlIndex - 1).indexOf('src') === -1) { return `<a target="_blank" rel="noopener noreferrer" href="${url}">${url}</a>`; }
      return url;
    });
  };
  const clickImage = useCallback(
    (e) => {
      onImageClick(e.src);
    },
    [onImageClick]
  );

  useEffect(() => {
    window.clickImage = clickImage;
    window.loadImage = onImageLoaded;

    return () => {
      window.clickImage = null;
      window.loadImage = null;
    };
  }, [clickImage, onImageLoaded]);

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

  const handleImageClick = (url) => () => {
    onImageClick(url);
  };

  const initials = getInitials(name);

  const renderItem = ({
    imageKey,
    body,
    isVideoNotification,
    firstName,
    files,
    isOwn
  }: {
    imageKey: string,
    body: string,
    files: object,
    isVideoNotification: boolean,
    firstName: string,
    isOwn: boolean
  }) => {
    const message = body.replace(/(\r\n|\n|\r)/gm, '<br />');

    if (['add_new_member', 'remove_user'].includes(imageKey)) {
      return (
        <div className={cx(classes.alertWrapper)}>
          <Typography
            className={classes.alert}
            dangerouslySetInnerHTML={{ __html: linkify(message) }}
          />
        </div>
      );
    }

    if (imageKey !== '') {
      return (
        <div className={classes.bodyWrapper}>
          <ButtonBase onClick={handleImageClick(imageKey)}>
            <img
              className={classes.image}
              src={imageKey}
              alt="chat"
              onLoad={onImageLoaded}
            />
          </ButtonBase>
        </div>
      );
    }

    if (isVideoNotification && !isOwn) {
      return (
        <div className={classes.bodyWrapper}>
          <Card className={classes.videoAlertRoot}>
            <CardContent classes={{ root: classes.cardContent }}>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
              >
                <b>{firstName}</b> started a Study Room 🎉
              </Typography>
              <Avatar alt={name} src={avatar}>
                {initials}
              </Avatar>
            </CardContent>
            <CardActions classes={{ root: classes.cardActions }}>
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
        message={message}
        files={files}
        onImageClick={onImageClick}
        onImageLoaded={onImageLoaded}
        renderHtmlWithImage={renderHtmlWithImage}
        smallChat
      />
    );
  };

  return (
    <>
      {messageList.map((message) => (
        <ListItem
          key={message.sid}
          alignItems="flex-start"
          className={classes.root}
        >
          <div className={classes.content}>
            {message.imageKey !== 'add_new_member' && (
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
          </div>
          <div className={classes.message}>
            {message.imageKey !== 'add_new_member' && (
              <div className={classes.messageHeader}>
                <Typography variant="subtitle2" className={classes.name}>
                  <Link
                    className={classes.link}
                    component={MyLink}
                    href={`/profile/${userId || ''}`}
                  >
                    {name}
                  </Link>
                  <Typography
                    className={cx(classes.createdAt)}
                    variant="caption"
                  >
                    {date} at {message.createdAt}
                  </Typography>
                </Typography>
              </div>
            )}
            {renderItem({
              imageKey: message.imageKey,
              body: message.body,
              isVideoNotification: message.isVideoNotification,
              files: message?.files,
              firstName: message.firstName,
              isOwn
            })}
          </div>
        </ListItem>
      ))}
    </>
  );
};

export default withRouter(ChatMessage);
