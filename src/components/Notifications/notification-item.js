// @flow
import React from 'react';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import type { Notification as NotificationState } from '../../types/models';
import questionImage from '../../assets/svg/ic_question_post.svg';
import flashcardImage from '../../assets/svg/ic_flashcard_post.svg';
import linkImage from '../../assets/svg/ic_link_post.svg';

const styles = () => ({
  primary: {
    // width: 200
  },
  image: {
    height: 40,
    width: 40
  },
  flashCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    height: 40,
    width: 40
  },
  flashCardImage: {
    width: 40
  },
  deckCount: {
    width: '100%',
    background: '#345952',
    textAlign: 'center',
    color: 'white',
    padding: 2,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5
  }
});

type Props = {
  classes: Object,
  notification: NotificationState,
  onClick: Function
};

type State = {};

class FeedItem extends React.PureComponent<Props, State> {
  handleClick = () => {
    const {
      notification: { postId, postTypeId, entityType },
      onClick
    } = this.props;

    if (entityType !== 8000) {
      onClick({ postId, typeId: postTypeId });
    } else {
      // this.props.getCustomNotificationRequest({ id, userId });
    }
  };

  renderStatic = () => {
    const {
      classes,
      notification: { entityType, postTypeId, noteUrl, deckSize }
    } = this.props;

    if (entityType === 1) {
      switch (postTypeId) {
        case 3:
          return (
            <div className={classes.flashCard}>
              <img
                src={flashcardImage}
                className={classes.flashCardImage}
                alt="Flascarhds"
              />
              <Typography
                className={classes.deckCount}
                variant="caption"
                style={{ fontSize: 8 }}
              >{`${deckSize} Cards`}</Typography>
            </div>
          );
        case 4:
          return (
            <Paper
              className={classes.image}
              style={{
                background: `url(${noteUrl})`,
                backgroundSize: 'cover'
              }}
            />
          );
        case 5:
          return (
            <Paper
              className={classes.image}
              style={{
                background: `url(${linkImage})`,
                backgroundSize: 'cover'
              }}
            />
          );
        case 6:
          return (
            <Paper
              className={classes.image}
              style={{
                background: `url(${questionImage})`,
                backgroundSize: 'cover'
              }}
            />
          );
        default:
          return null;
      }
    }

    return null;
  };

  render() {
    const {
      classes,
      notification: {
        actorFirstName,
        actorLastName,
        profileImageUrl,
        notificationText,
        createdOn
      }
    } = this.props;
    const name = `${actorFirstName} ${actorLastName}`;
    const initials = name !== '' ? (name.match(/\b(\w)/g) || []).join('') : '';
    const date = moment(createdOn);
    const fromNow = date ? date.fromNow() : '';

    return (
      <ListItem button alignItems="flex-start" onClick={this.handleClick}>
        <ListItemAvatar>
          <Avatar src={profileImageUrl} alt={name}>
            {initials}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={notificationText}
          primaryTypographyProps={{ className: classes.primary }}
          secondary={fromNow}
          secondaryTypographyProps={{ color: 'textPrimary' }}
        />
        {this.renderStatic()}
      </ListItem>
    );
  }
}

export default withStyles(styles)(FeedItem);
