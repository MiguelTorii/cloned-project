// @flow
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import EmptyFeed from 'components/FeedList/EmptyFeed'
import FeedItem from './feed-item';

const styles = theme => ({
  container: {
    maxHeight: 'inherit',
    // display: 'flex',
    padding: theme.spacing(),
    position: 'relative',
    minHeight: 400
  },
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(),
    paddingBottom: theme.spacing(),
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between'
  },
  marginBottom: {
    marginBottom: theme.spacing()
  },
  title: {
    flex: 1
  },
  textField: {
    marginLeft: theme.spacing(),
    flex: 1
  },
  items: {
    overflowY: 'auto',
    // maxHeight: 'calc(100vh - 250px)',
    flex: 1,
    marginTop: theme.spacing()
  },
  margin: {
    margin: theme.spacing(2)
  },
  popover: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2)
  },
  loader: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  progress: {
    width: 180,
    height: 100,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: theme.spacing(),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  feedEnd: {
    backgroundColor: theme.circleIn.palette.appBar,
    padding: 10,
    width: '100%',
  },
  endLabel: {
    textAlign: 'center'
  },
});

type Props = {
  classes: Object,
  userId: string,
  items: Array<Object>,
  isLoading: boolean,
  hasMore: boolean,
  fromFeedId: ?number,
  handleShare: Function,
  onPostClick: Function,
  onBookmark: Function,
  onReport: Function,
  onDelete: Function,
  pushTo: Function,
  onLoadMore: Function,
  newClassExperience: boolean,
  onUserClick: Function
};

type State = {};

class FeedList extends React.PureComponent<Props, State> {
  state = {};

  componentDidMount = () => {
    this.mounted = true;
  };

  componentDidUpdate = () => {
    if (this.mounted && this.selectedRef) this.handleScrollToRef();
  };

  componentWillUnmount = () => {
    this.mounted = false;
  };

  emptyMessage = pathname => {
    if (pathname === '/bookmarks') return `It looks like you don't have any bookmarks yet. Once you find a post that you want to save to view later, bookmark it and it'll appear here`
    if (pathname === '/my_posts') return 'Be the first in your class to earn points toward your scholarship and gifts. Post your notes now.'
    return `Your classmate's notes, flashcards and questions will appear here. Be the first to post to get closer to a Reward or Scholarship!`
  }


  handleScrollToRef = () => {
    if (this.selectedRef && this.selectedRef.el) {
      this.selectedRef.el.scrollIntoView({ behavior: 'instant' });
    }
  };

  // eslint-disable-next-line no-undef
  scrollParentRef: ?HTMLDivElement;

  selectedRef: {
    // eslint-disable-next-line no-undef
    el: ?HTMLDivElement
  };

  mounted: boolean;

  render() {
    const {
      classes,
      userId,
      isLoading,
      items,
      handleShare,
      onPostClick,
      onBookmark,
      onReport,
      onDelete,
      hasMore,
      pushTo,
      fromFeedId,
      onLoadMore,
      newClassExperience,
      onUserClick,
      location: { pathname },
    } = this.props;

    return (
      <div className={`${classes.container} tour-onboarding-feed`}>
        {isLoading && (
          <div className={classes.loader}>
            <div className={classes.progress}>
              <Typography align="center" variant="subtitle1" paragraph>
                Loading Posts
              </Typography>
              <CircularProgress size={20} />
            </div>
          </div>
        )}
        {newClassExperience && pathname === '/feed' && <EmptyFeed />}
        <Paper className={classes.root} elevation={0}>
          <div
            className={classes.items}
            ref={node => {
              this.scrollParentRef = node;
            }}
          >
            <InfiniteScroll
              threshold={50}
              pageStart={0}
              loadMore={onLoadMore}
              hasMore={hasMore}
              useWindow
              initialLoad={false}
              getScrollParent={() => this.scrollParentRef}
            >
              {items.map(item => (
                <FeedItem
                  key={item.feedId}
                  userId={userId}
                  data={item}
                  handleShareClick={handleShare}
                  innerRef={node => {
                    if (fromFeedId === item.feedId) this.selectedRef = node;
                  }}
                  onPostClick={onPostClick}
                  newClassExperience={newClassExperience}
                  onBookmark={onBookmark}
                  pushTo={pushTo}
                  onReport={onReport}
                  onDelete={onDelete}
                  onUserClick={onUserClick}
                />
              ))
              }
            </InfiniteScroll>
          </div>
          {items.length === 0 &&
          <Typography className={classes.endLabel}>{this.emptyMessage(pathname)}</Typography>}
        </Paper>
        {
          items.length !== 0 && !hasMore &&
          <div className={classes.feedEnd}>
            <Typography variant="h6" align="center">
              All posts have been loaded
            </Typography>
          </div>
        }
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(FeedList));
