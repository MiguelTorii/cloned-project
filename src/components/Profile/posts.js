// @flow
import React from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import type { FeedItem as FeedItemState } from '../../types/models';
import FeedItem from '../FeedList/feed-item';

const styles = theme => ({
  container: {
    height: '100%',
    maxHeight: 'inherit',
    display: 'flex',
    padding: theme.spacing.unit
  },
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 4,
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
  onShare: Function,
  onPostClick: Function,
  onBookmark: Function,
  onReport: Function,
  onDelete: Function,
  onUserClick: Function
};

class Posts extends React.PureComponent<Props> {
  render() {
    const {
      classes,
      userId,
      posts,
      onShare,
      onPostClick,
      onBookmark,
      onReport,
      onDelete,
      onUserClick
    } = this.props;

    if (posts.length === 0)
      return (
        <div className={cx(classes.container, classes.nothing)}>
          <Typography variant="h6" color="textPrimary" align="center">
            Nothing to see here... yet
          </Typography>
        </div>
      );

    return (
      <div className={classes.container}>
        <Paper className={classes.root} elevation={0}>
          {posts.map(item => (
            <FeedItem
              key={item.feedId}
              userId={userId}
              data={item}
              handleShareClick={onShare}
              onPostClick={onPostClick}
              onBookmark={onBookmark}
              onReport={onReport}
              onDelete={onDelete}
              onUserClick={onUserClick}
            />
          ))}
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(Posts);
