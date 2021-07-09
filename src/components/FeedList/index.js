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
import ExpertFeedEmpty from 'assets/svg/expertFeedEmpty.svg'
import LoadImg from 'components/LoadImg'
import Box from '@material-ui/core/Box'
import ImgLoading from 'assets/gif/feed-loading.gif';
import FeedItem from './FeedItem';

import styles from '../_styles/FeedList';

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
  // eslint-disable-next-line no-undef
  scrollParentRef: ?HTMLDivElement;

  selectedRef: {
    // eslint-disable-next-line no-undef
    el: ?HTMLDivElement
  };

  mounted: boolean;

  constructor(props) {
    super(props)
    this.quillRefs = {}
    this.newComments = {}
  }

  // eslint-disable-next-line react/sort-comp
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
    const { classes, expertMode } = this.props;

    if (expertMode) return (
      <Box
        justifyContent='center'
        alignItems='center'
        display='flex'
        flexDirection='column'
      >
        <Box className={classes.expertContainerText}>
          <Box
            justifyContent='center'
            alignItems='center'
            display='flex'
            flexDirection='column'
          >
            <Typography className={classes.expertTitle}>
              Welcome! <span role='img' aria-label='wave'>👋</span> We’ve been waiting for you!
            </Typography>
            <Typography className={classes.expertTitle}>
              Start supporting your students by posting a
            </Typography>
            <Typography className={classes.expertTitle}>
              “hello” and your “office hours”. :)
            </Typography>
          </Box>
        </Box>
        <LoadImg url={ExpertFeedEmpty} />
      </Box>
    )


    if (pathname === '/bookmarks') return (
      <EmptyState
        imageUrl={EmptyBookmarks}
        title="When you bookmark posts you can search for them!"
      />
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
          Click <p className={classes.newPost}>+ Create New Post</p> to post and earn points,
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

  setQuillRefs = (feedId, ref) => {
    this.quillRefs[feedId] = ref
  }

  setNewComments = (feedId, content) => {
    this.newComments[feedId] = content
  }

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
      schoolId,
      location: { pathname },
    } = this.props;

    return (
      <div className={`${classes.container} tour-onboarding-feed`}>
        {isLoading && items.length === 0 && (
          <>
            <Box display="flex" justifyContent="center">
              <img
                src={ImgLoading}
                alt="load feeds"
                className={classes.loadingGif}
              />
            </Box>
            <Typography
              className={classes.loadingText}
              variant="h4"
              align="center"
              gutterBottom
            >
              Loading...
            </Typography>
            <Typography className={classes.loadingSmallText} align="center">
              Take a delightfully slow and relaxing <br />
              deep breath while we apply your filters!
            </Typography>
          </>
        )}
        {isLoading && items.length !== 0 && (
          <div className={classes.loader}>
            <div className={classes.progress}>
              <Typography align="center" variant="subtitle1" paragraph>
                Loading Posts
              </Typography>
              <CircularProgress size={20} />
            </div>
          </div>
        )}
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
            initialLoad
            getScrollParent={() => this.scrollParentRef}
          >
            {items.map(item => (
              <Paper className={classes.root} elevation={0}>
                <FeedItem
                  key={item.feedId}
                  schoolId={schoolId}
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
                  setQuillRefs={this.setQuillRefs}
                  quillRefs={this.quillRefs}
                  setNewComments={this.setNewComments}
                  newComments={this.newComments}
                />
              </Paper>
            ))
            }
          </InfiniteScroll>
        </div>
        <Paper className={classes.root} elevation={0}>
          {!isLoading && items.length === 0 && this.getEmptyState(pathname)}
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
