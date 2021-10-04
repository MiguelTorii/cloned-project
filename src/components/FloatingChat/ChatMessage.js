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

import OnlineBadge from 'components/OnlineBadge/OnlineBadge';
import RoleBadge from 'components/RoleBadge/RoleBadge';
import { getInitials } from 'utils/chat';
import { styles } from '../_styles/FloatingChat/ChatMessage';
import { PROFILE_PAGE_SOURCE } from '../../constants/common';
import { buildPath } from '../../utils/helpers';

const MyLink = React.forwardRef(({ href, ...props }, ref) => (
  <RouterLink to={href} {...props} ref={ref} />
));

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

class ChatMessage extends React.PureComponent<Props> {
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

    return (
      <div className={cx(classes.bodyWrapper, isOwn && classes.reverse)}>
        <Typography
          className={cx(classes.body, isOwn && classes.right)}
          dangerouslySetInnerHTML={{ __html: this.linkify(message) }}
        />
        <Typography className={cx(classes.createdAt)} variant="caption">
          {createdAt}
        </Typography>
      </div>
    );
  };

  render() {
    const { role, classes, userId, isUserOnline, name, avatar, isOwn, messageList } = this.props;

    const initials = getInitials(name);

    return (
      <ListItem alignItems="flex-start" className={cx(classes.root, isOwn && classes.justifyEnd)}>
        {!isOwn && (
          <ListItemAvatar
            className={classes.avatarLink}
            component={MyLink}
            href={buildPath(`/profile/${userId}`, { from: PROFILE_PAGE_SOURCE.CHAT })}
          >
            <OnlineBadge isOnline={isUserOnline} bgColorPath="circleIn.palette.feedBackground">
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
                href={buildPath(`/profile/${userId}`, { from: PROFILE_PAGE_SOURCE.CHAT })}
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

export default withStyles(styles)(ChatMessage);
