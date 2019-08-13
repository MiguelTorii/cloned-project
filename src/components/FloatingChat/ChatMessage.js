/* eslint-disable react/no-danger */
// @flow
import React from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Link from '@material-ui/core/Link';
// import bell from '../../assets/img/bell.png';

const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    alignItems: 'flex-start',
    maxWidth: '80%'
  },
  justifyEnd: {
    justifyContent: 'flex-end'
  },
  alignEnd: {
    alignItems: 'flex-end'
  },
  name: {
    color: 'white'
  },
  message: {
    maxWidth: '100%',
    marginTop: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column'
  },
  bodyWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    flex: 1
  },
  reverse: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end'
  },
  image: {
    borderRadius: 5,
    marginBottom: theme.spacing.unit,
    maxWidth: 120
  },
  createdAt: {
    marginLeft: 5,
    color: theme.circleIn.palette.primaryText1
  },
  createdAtRight: {
    marginRight: 5
  },
  video: {
    flex: 1,
    // borderRadius: 20,
    padding: '5px 10px 5px 10px',
    // backgroundColor: 'grey',
    // wordWrap: 'break-word',
    minWidth: 270,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginLeft: -55
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
    backgroundColor: '#f5f5f5',
    color: '#303030',
    wordWrap: 'break-word',
    maxWidth: 160
    // 'word-break': 'break-all'
  },
  right: {
    textAlign: 'right',
    backgroundColor: '#5dcbfd'
  },
  link: {
    color: theme.palette.primary.main
  }
});

type Props = {
  classes: Object,
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
    name: '',
    avatar: '',
    isOwn: false
  };

  linkify = (text: string) => {
    // eslint-disable-next-line
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    return text.replace(urlRegex, url => {
      return `<a target="_blank" rel="noopener noreferrer" href="${url}">${url}</a>`;
    });
  };

  handleImageClick = url => () => {
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
    const dudUrl = 'javascript:;';

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
      );
    }

    return (
      <div className={cx(classes.bodyWrapper, isOwn && classes.reverse)}>
        <Typography
          className={cx(classes.body, isOwn && classes.right)}
          dangerouslySetInnerHTML={{ __html: this.linkify(message) }}
        />
        <Typography
          className={cx(classes.createdAt, isOwn && classes.createdAtRight)}
        >
          {createdAt}
        </Typography>
      </div>
    );
  };

  render() {
    const { classes, name, avatar, isOwn, messageList } = this.props;
    const initials =
      name && name !== '' ? (name.match(/\b(\w)/g) || []).join('') : '';

    return (
      <ListItem
        alignItems="flex-start"
        className={cx(classes.root, isOwn && classes.justifyEnd)}
      >
        {!isOwn && (
          <ListItemAvatar>
            <Avatar alt={name} src={avatar}>
              {initials}
            </Avatar>
          </ListItemAvatar>
        )}
        <div className={cx(classes.content, isOwn && classes.alignEnd)}>
          {!isOwn && (
            <Typography variant="subtitle1" className={classes.name}>
              {name}
            </Typography>
          )}
          {messageList.map(message => (
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
