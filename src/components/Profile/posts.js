// @flow
import React from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import type { FeedItem as FeedItemState } from '../../types/models';
import FeedItem from '../FeedList/FeedItem';

const styles = theme => ({
  container: {
    height: '100%',
    maxHeight: 'inherit',
    display: 'flex',
    padding: theme.spacing()
  },
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    flex: 1
  },
  nothing: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});

type Props = {
  classes: Object,
  userId: string,
  posts: Array<FeedItemState>,
  isMyProfile: boolean,
  isBookmarks: boolean,
  onShare: Function,
  onPostClick: Function,
  onBookmark: Function,
  onReport: Function,
  onDelete: Function,
  pushTo: Function,
  onUserClick: Function
};

class ProfilePosts extends React.PureComponent<Props> {
  render() {
    const {
      classes,
      pushTo,
      userId,
      posts,
      isMyProfile,
      isBookmarks,
      onShare,
      onPostClick,
      onBookmark,
      onReport,
      onDelete,
      onUserClick
    } = this.props;

    if (posts.length === 0) {
      if (isBookmarks)
        return (
          <div className={cx(classes.container, classes.nothing)}>
            <Typography variant="h6" color="textPrimary" align="center">
               It looks like you don't have any bookmarks yet. Once you find a post that you want to save to view later, bookmark it and it'll appear here
            </Typography>
          </div>
        );

      return (
        <div className={cx(classes.container, classes.nothing)}>
          <Typography variant="h6" color="textPrimary" align="center">
            {isMyProfile
              ? 'You do not have any posts yet. Once you create a post you can come back here to view them'
              : "Please check back later. They haven't created any posts yet."}
          </Typography>
        </div>
      );
    }

    return (
      <div className={classes.container}>
        <Paper className={classes.root} elevation={0}>
          {posts.map(item => (
            <FeedItem
              key={item.feedId}
              postId={item.postId}
              typeId={item.typeId}
              userId={userId}
              data={item}
              handleShareClick={onShare}
              onPostClick={onPostClick}
              onBookmark={onBookmark}
              onReport={onReport}
              onDelete={onDelete}
              pushTo={pushTo}
              onUserClick={onUserClick}
            />
          ))}
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(ProfilePosts);
