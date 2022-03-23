import React from 'react';

import InfiniteScroll from 'react-infinite-scroll-component';
import { withRouter } from 'react-router';

import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { COMMUNITY_SCROLL_CONTAINER_ID } from 'constants/common';

import ImgLoading from 'assets/gif/class-feed-loading.gif';
import FilterLoading from 'assets/gif/feed-loading.gif';
import EmptyBookmarks from 'assets/svg/empty-bookmarks.svg';
import EmptyFeed from 'assets/svg/empty-feed.svg';
import EmptyMyPosts from 'assets/svg/empty-my-posts.svg';
import ExpertFeedEmpty from 'assets/svg/expertFeedEmpty.svg';

import styles from '../_styles/FeedList';
import LoadImg from '../LoadImg/LoadImg';

import EmptyState from './EmptyState';
import FeedItem from './FeedItem';

import type { TFeedItem } from 'types/models';

type Props = {
  classes?: Record<string, any>;
  userId?: string;
  items?: Array<TFeedItem>;
  isLoading?: boolean;
  hasMore?: boolean;
  fromFeedId?: number | null | undefined;
  classList?: any;
  expertMode?: boolean;
  schoolId?: any;
  location?: {
    pathname: string;
  };
  isFiltering: boolean;
  handleShare?: (...args: Array<any>) => any;
  onPostClick?: (...args: Array<any>) => any;
  onBookmark?: (...args: Array<any>) => any;
  onReport?: (...args: Array<any>) => any;
  onDelete?: (...args: Array<any>) => any;
  pushTo?: (...args: Array<any>) => any;
  onLoadMore?: (...args: Array<any>) => any;
  onUserClick?: (...args: Array<any>) => any;
};

type State = {};

class FeedList extends React.PureComponent<Props, State> {
  quillRefs: Record<string, any>;

  newComments: Record<string, any>;

  selectedRef: {
    // eslint-disable-next-line no-undef
    el: HTMLDivElement | null | undefined;
  };

  mounted: boolean;

  constructor(props) {
    super(props);
    this.quillRefs = {};
    this.newComments = {};
  }

  // eslint-disable-next-line react/sort-comp
  componentDidMount = () => {
    this.mounted = true;
  };

  componentDidUpdate = () => {
    if (this.mounted && this.selectedRef) {
      this.handleScrollToRef();
    }
  };

  componentWillUnmount = () => {
    this.mounted = false;
  };

  getEmptyState = (pathname) => {
    const { classes, expertMode } = this.props;

    if (expertMode) {
      return (
        <Box justifyContent="center" alignItems="center" display="flex" flexDirection="column">
          <Box className={classes.expertContainerText}>
            <Box justifyContent="center" alignItems="center" display="flex" flexDirection="column">
              <Typography className={classes.expertTitle}>
                Welcome!{' '}
                <span role="img" aria-label="wave">
                  👋
                </span>{' '}
                We’ve been waiting for you!
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
      );
    }

    if (pathname === '/bookmarks') {
      return (
        <EmptyState
          imageUrl={EmptyBookmarks}
          title="When you bookmark posts you can search for them!"
        />
      );
    }

    if (pathname === '/my_posts') {
      return (
        <EmptyState imageUrl={EmptyMyPosts} title="Your posts will appear here">
          After posting, your study material will be here for you to view later for an exam
        </EmptyState>
      );
    }

    return (
      <EmptyState imageUrl={EmptyFeed} title="">
        <div className={classes.title2}>
          Post and earn points and get yourself closer to winning a gift card or scholarship!
        </div>
      </EmptyState>
    );
  };

  handleScrollToRef = () => {
    if (this.selectedRef && this.selectedRef.el) {
      this.selectedRef.el.scrollIntoView({
        behavior: 'auto'
      });
    }
  };

  setQuillRefs = (feedId, ref) => {
    this.quillRefs[feedId] = ref;
  };

  setNewComments = (feedId, content) => {
    this.newComments[feedId] = content;
  };

  isCurrent = (classId) => {
    const { classList } = this.props;
    const filteredList = classList.filter((cl) => cl.classId === classId);

    if (filteredList.length > 0) {
      return filteredList[0].isCurrent;
    }
  };

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
      expertMode,
      onUserClick,
      schoolId,
      location: { pathname },
      isFiltering
    } = this.props;
    return (
      <div className={`${classes.container} tour-onboarding-feed`}>
        {isLoading && !isFiltering && items.length === 0 && (
          <>
            <Box display="flex" justifyContent="center">
              <img src={ImgLoading} alt="load feeds" className={classes.loadingGif} />
            </Box>
            <Typography className={classes.loadingText} variant="h4" align="center" gutterBottom>
              Loading...
            </Typography>
            <Typography className={classes.loadingSmallText} align="center">
              Take a delightfully slow and relaxing <br />
              deep breath while we apply your filters!
            </Typography>
          </>
        )}
        {isFiltering && (
          <>
            <Box display="flex" justifyContent="center">
              <img src={FilterLoading} alt="Filter Feeds" className={classes.loadingGif} />
            </Box>
            <Typography className={classes.loadingText} variant="h4" align="center" gutterBottom>
              Loading...
            </Typography>
            <Typography className={classes.loadingSmallText} align="center">
              Take a delightfully slow and relaxing <br />
              deep breath while we apply your filters!
            </Typography>
          </>
        )}
        <Paper className={classes.root} elevation={0}>
          {!isLoading && items.length === 0 && this.getEmptyState(pathname)}
        </Paper>
        {items.length > 0 && (
          <InfiniteScroll
            dataLength={items.length}
            next={onLoadMore}
            hasMore={hasMore}
            loader={
              <Box display="flex" justifyContent="center">
                <div className={classes.progress}>
                  <Typography align="center" variant="subtitle1" paragraph>
                    Loading Posts
                  </Typography>
                  <CircularProgress size={20} />
                </div>
              </Box>
            }
            endMessage={
              <div className={classes.feedEnd}>
                <Typography variant="h6" align="center">
                  All posts have been loaded
                </Typography>
              </div>
            }
            scrollableTarget={COMMUNITY_SCROLL_CONTAINER_ID}
          >
            {items.map((item) => (
              <Paper key={item.feedId} className={classes.root} elevation={0}>
                <FeedItem
                  schoolId={schoolId}
                  expertMode={expertMode}
                  userId={userId}
                  data={item}
                  handleShareClick={handleShare}
                  innerRef={(node) => {
                    if (fromFeedId === item.feedId) {
                      this.selectedRef = node;
                    }
                  }}
                  onPostClick={onPostClick}
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
            ))}
          </InfiniteScroll>
        )}
      </div>
    );
  }
}

export default withStyles(styles as any)(withRouter(FeedList));
