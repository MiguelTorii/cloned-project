/* eslint-disable react/no-danger */
// @flow
import React from 'react';
import cx from 'classnames';
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
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
// import TutorBadge from 'components/TutorBadge'
import OnlineBadge from 'components/OnlineBadge';
import { ReactComponent as Camera } from 'assets/svg/camera-join-room.svg';

const MyLink = React.forwardRef(({ href, ...props }, ref) => <RouterLink to={href} {...props} ref={ref} />);

const styles = theme => ({
  root: {
    padding: theme.spacing(1, 6),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    }
  },
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
    alignItems: 'flex-start'
  },
  justifyEnd: {
    justifyContent: 'flex-end'
  },
  name: {
    color: 'white',
    paddingLeft: 0,
  },
  message: {
    maxWidth: '100%',
    margin: theme.spacing(0.5),
    display: 'flex',
    flexDirection: 'column'
  },
  bodyWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    borderRadius: 5,
    marginBottom: theme.spacing(),
    maxWidth: 120
  },
  createdAt: {
    paddingLeft: theme.spacing(2),
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
    flexDirection: 'column',
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
    textAlign: 'left',
    color: 'white',
    wordWrap: 'break-word',
    width: '100%'
  },
  avatarLink: {
    textDecoration: 'none',
    minWidth: 45,
    marginTop: 3
  },
  link: {
    color: 'white',
    fontSize: '1rem',
    fontWeight: 700
  },
  videoAlertRoot: {
    minWidth: 275,
    backgroundColor: theme.circleIn.palette.appBar,
    borderRadius: 20
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    color: 'white',
    fontSize: 14,
  },
  cardContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(0, 2, 2, 2)
  },
  join: {
    background: 'linear-gradient(180deg, #94DAF9 0%, #1E88E5 100%)',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: 10
  },
  camera: {
    marginRight: theme.spacing(1)
  }
});

type Props = {
  classes: Object,
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
    createdAt,
    isOwn
  }: {
    imageKey: string,
    body: string,
    isVideoNotification: boolean,
    firstName: string,
    createdAt: string,
    isOwn: boolean
  }) => {
    const { classes, onImageLoaded, onStartVideoCall, name, avatar } = this.props;

    const message = body.replace(/(\r\n|\n|\r)/gm, '<br />');
    const initials =
      name && name !== '' ? (name.match(/\b(\w)/g) || []).join('') : '';
    // eslint-disable-next-line no-script-url

    if (imageKey !== '') {
      return (
        <div className={classes.bodyWrapper}>
          <ButtonBase onClick={this.handleImageClick(imageKey)}>
            <img
              className={classes.image}
              src={imageKey}
              alt="chat"
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
          <Card className={classes.videoAlertRoot}>
            <CardContent classes={{ root: classes.cardContent }}>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                <b>{firstName}</b>  started a Study Room 🎉
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
      <div className={cx(classes.bodyWrapper)}>
        <Typography
          className={classes.body}
          dangerouslySetInnerHTML={{ __html: this.linkify(message) }}
        />
      </div>
    );
  };

  render() {
    const {
      // role,
      classes,
      userId,
      name,
      avatar,
      isOwn,
      isOnline,
      messageList
    } = this.props;
    const initials =
      name && name !== '' ? (name.match(/\b(\w)/g) || []).join('') : '';

    return (
      <>
        {messageList.map(message => (
          <ListItem
            key={message.sid}
            alignItems="flex-start"
            className={classes.root}
          >
            <div className={classes.content}>
              <ListItemAvatar
                className={classes.avatarLink}
                component={MyLink}
                href={`/profile/${userId || ''}`}
              >
                <OnlineBadge isOnline={isOnline} bgColorPath="circleIn.palette.primaryBackground">
                  <Avatar alt={name} src={avatar}>
                    {initials}
                  </Avatar>
                </OnlineBadge>
              </ListItemAvatar>
            </div>
            <div className={classes.message}>
              <Typography variant="caption" className={classes.name}>
                <Link
                  className={classes.link}
                  component={MyLink}
                  href={`/profile/${userId || ''}`}
                >
                  {name}
                </Link>
                {/* {role && <TutorBadge text={role} />} */}
                <Typography
                  className={cx(classes.createdAt)}
                  variant="caption"
                >
                  {message.createdAt}
                </Typography>
              </Typography>
              {this.renderItem({
                imageKey: message.imageKey,
                body: message.body,
                isVideoNotification: message.isVideoNotification,
                firstName: message.firstName,
                createdAt: message.createdAt,
                isOwn
              })}
            </div>
          </ListItem>
        ))}
      </>
    );
  }
}

export default withStyles(styles)(ChatMessage);
