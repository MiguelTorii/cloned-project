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
import bell from '../../assets/img/bell.png';

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
    color: 'grey'
  },
  video: {
    flex: 1,
    borderRadius: 20,
    padding: '5px 20px 5px 20px',
    backgroundColor: 'grey',
    wordWrap: 'break-word',
    maxWidth: 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    cursor: 'pointer'
  },
  videoTitle: {
    textAlign: 'center',
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
    backgroundColor: 'grey',
    color: 'white',
    wordWrap: 'break-word',
    maxWidth: 250,
    'word-break': 'break-all'
  },
  right: {
    textAlign: 'right'
  }
});

type Props = {
  classes: Object,
  name?: string,
  avatar?: string,
  isOwn?: boolean,
  messageList: Array<Object>,
  onImageLoaded: Function
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

  renderItem = ({
    imageKey,
    body,
    isVideoNotification,
    firstName,
    lastName,
    createdAt,
    isOwn
  }: {
    sid: string,
    imageKey: string,
    body: string,
    isVideoNotification: boolean,
    firstName: string,
    lastName: string,
    createdAt: string,
    isOwn: boolean
  }) => {
    const { classes, onImageLoaded } = this.props;
    if (imageKey !== '') {
      return (
        <div className={classes.bodyWrapper}>
          <ButtonBase>
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
          <ButtonBase className={classes.video}>
            <img src={bell} alt="bell" />
            <Typography
              className={classes.videoTitle}
            >{`${firstName} ${lastName} has invited you to a video meet-up.`}</Typography>
            <Typography className={classes.videoSubTitle}>
              Tap here to join!
            </Typography>
          </ButtonBase>
          <Typography className={classes.createdAt}>{createdAt}</Typography>
        </div>
      );
    }
    return (
      <div className={cx(classes.bodyWrapper, isOwn && classes.reverse)}>
        <Typography
          className={cx(classes.body, isOwn && classes.right)}
          dangerouslySetInnerHTML={{ __html: this.linkify(body) }}
        />
        <Typography className={classes.createdAt}>{createdAt}</Typography>
      </div>
    );
  };

  render() {
    const { classes, name, avatar, isOwn, messageList } = this.props;
    const initials = name !== '' ? (name.match(/\b(\w)/g) || []).join('') : '';

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
                isOwn
              })}
            </div>
          ))}
        </div>
      </ListItem>
    );
  }
}

export default withStyles(styles)(ChatMessageDate);
