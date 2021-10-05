import React from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import type { FeedItem as FeedItemState } from '../../types/models';
import FeedItem from '../FeedList/FeedItem';
import { styles } from '../_styles/Profile/posts';

type Props = {
  classes?: Record<string, any>;
  classList?: any;
  userId?: string;
  posts?: Array<FeedItemState>;
  isMyProfile?: boolean;
  isBookmarks?: boolean;
  onShare?: (...args: Array<any>) => any;
  onPostClick?: (...args: Array<any>) => any;
  onBookmark?: (...args: Array<any>) => any;
  onReport?: (...args: Array<any>) => any;
  onDelete?: (...args: Array<any>) => any;
  pushTo?: (...args: Array<any>) => any;
  onUserClick?: (...args: Array<any>) => any;
};

class ProfilePosts extends React.PureComponent<Props> {
  quillRefs: any;

  newComments: any;

  constructor(props) {
    super(props);
    this.quillRefs = {};
    this.newComments = {};
  }

  setQuillRefs = (feedId, ref) => {
    this.quillRefs[feedId] = ref;
  };

  setNewComments = (feedId, content) => {
    this.newComments[feedId] = content;
  };

  render() {
    const {
      classes,
      classList,
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
      if (isBookmarks) {
        return (
          <div className={cx(classes.container, classes.nothing)}>
            <Typography variant="h6" color="textPrimary" align="center">
              {
                "It looks like you don't have any bookmarks yet. Once you find a post that you want to save to view later, bookmark it and it'll appear here"
              }
            </Typography>
          </div>
        );
      }

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
          {posts.map((item) => (
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
              setQuillRefs={this.setQuillRefs}
              quillRefs={this.quillRefs}
              setNewComments={this.setNewComments}
              newComments={this.newComments}
              toolbarPrefix={isBookmarks ? 'bookmark' : ''}
            />
          ))}
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles as any)(ProfilePosts);
