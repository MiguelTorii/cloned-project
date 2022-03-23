import React from 'react';

import moment from 'moment';

import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import flashcardImage from 'assets/svg/ic_flashcard_post.svg';
import linkImage from 'assets/svg/ic_link_post.svg';
import questionImage from 'assets/svg/ic_question_post.svg';
import Avatar from 'components/Avatar';

import { styles } from '../_styles/Notifications/notification-item';

import type { Notification as NotificationState } from 'types/models';

type Props = {
  classes: Record<string, any>;
  notification: NotificationState;
  onClick: (...args: Array<any>) => any;
};
type State = {};

class FeedItem extends React.PureComponent<Props, State> {
  handleClick = () => {
    const {
      notification: { postId, postTypeId, entityType, id },
      onClick
    } = this.props;
    onClick({
      entityType,
      postId,
      typeId: postTypeId,
      id
    });
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
              <img src={flashcardImage} className={classes.flashCardImage} alt="Flascarhds" />
              <Typography
                className={classes.deckCount}
                variant="caption"
                style={{
                  fontSize: 8
                }}
              >
                {`${deckSize} Cards`}
              </Typography>
            </div>
          );

        case 4:
          return (
            <Paper
              elevation={2}
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
              elevation={2}
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
              elevation={2}
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
      notification: { actorFirstName, actorLastName, profileImageUrl, notificationText, createdOn }
    } = this.props;
    const name = `${actorFirstName} ${actorLastName}`;
    const date = moment(createdOn);
    const fromNow = date ? date.fromNow() : '';
    return (
      <ListItem button alignItems="flex-start" onClick={this.handleClick}>
        <ListItemAvatar>
          <Avatar profileImage={profileImageUrl} fullName={name} fromChat />
        </ListItemAvatar>
        <ListItemText
          primary={notificationText}
          primaryTypographyProps={{
            className: classes.primary
          }}
          secondary={fromNow}
          secondaryTypographyProps={{
            color: 'textPrimary'
          }}
        />
        {this.renderStatic()}
      </ListItem>
    );
  }
}

export default withStyles(styles as any)(FeedItem);
