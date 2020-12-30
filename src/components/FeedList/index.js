// @flow
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import EmptyState from 'components/FeedList/EmptyState';
import EmptyFeed from 'assets/svg/empty-feed.svg'
import EmptyBookmarks from 'assets/svg/empty-bookmarks.svg'
import EmptyMyPosts from 'assets/svg/empty-my-posts.svg'
import FeedItem from './FeedItem';

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
  title2: {
    color: theme.circleIn.palette.primaryText1,
    paddingBottom: 23,
    paddingTop: 26,
    maxWidth: 740,
    fontSize: 26,
    textAlign: 'center',
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
  newPost: {
    background: theme.circleIn.palette.brand,
    borderRadius: 20,
    color: 'black',
    display: 'inline',
    fontSize: 22,
    fontWeight: 'bold',
    margin: '0px 3px',
    padding: '0px 16px',
    width: 100,
  }
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

  getEmptyState = pathname => {
    const { classes } = this.props;

    if (pathname === '/bookmarks') return (
      <EmptyState
        imageUrl={EmptyBookmarks}
        title="Bookmark helpful study material to review later"
      >
        Once you bookmark a post on the Class Feed, it’ll appear here
      </EmptyState>
    )

    if (pathname === '/my_posts') return (
      <EmptyState
        imageUrl={EmptyMyPosts}
        title="Your posts will appear here"
      >
        After posting, your study material will be here for you to view later for an exam
      </EmptyState>
    )

    return (
      <EmptyState imageUrl={EmptyFeed} title=""
      >
        <div className={classes.title2}>
          Click <p className={classes.newPost}>+ New</p> to post and earn points,
          and get yourself closer to winning a gift card or scholarship!
        </div>
      </EmptyState>
    )
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
      expertMode,
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
                  expertMode={expertMode}
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
          {items.length === 0 && this.getEmptyState(pathname)}
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
