// @flow

import React, { Fragment } from 'react';
import debounce from 'lodash/debounce';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push as routePush } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import FeedList from '../../components/FeedList';
import type { State as StoreState } from '../../types/state';
import type { UserState } from '../../reducers/user';
import type { FeedState } from '../../reducers/feed';
import { getUserClasses } from '../../api/user';
import { logEvent } from '../../api/analytics';
import SharePost from '../SharePost';
import Report from '../Report';
import DeletePost from '../DeletePost';
import { processUserClasses } from './utils';
import ErrorBoundary from '../ErrorBoundary';
import * as feedActions from '../../actions/feed';

const defaultClass = JSON.stringify({ classId: -1, sectionId: -1 });

const styles = () => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    flex: 1,
    overflow: 'hidden',
    maxHeight: 'inherit'
  }
});

type Props = {
  classes: Object,
  user: UserState,
  feed: FeedState,
  feedId: ?number,
  classId: number,
  sectionId: number,
  bookmarks: boolean,
  push: Function,
  fetchFeed: Function,
  updateBookmark: Function
};

type State = {
  feedId: ?number,
  report: ?Object,
  deletePost: ?Object,
  from: string,
  userClass: string,
  postType: number,
  classesList: Array<{ value: string, label: string }>,
  query: string,
  limit: number
};

class Feed extends React.PureComponent<Props, State> {
  state = {
    feedId: null,
    report: null,
    deletePost: null,
    from: 'everyone',
    userClass: defaultClass,
    postType: 0,
    classesList: [],
    query: '',
    limit: 100
  };

  componentDidMount = async () => {
    this.mounted = true;
    const { classId, sectionId, bookmarks } = this.props;
    if (classId >= 0 && sectionId >= 0) {
      this.setState({ userClass: JSON.stringify({ classId, sectionId }) });
    }
    if (bookmarks) {
      this.setState({ from: 'bookmarks' });
    }
    window.addEventListener('offline', () => {
      if (
        this.handleFetchFeed.cancel &&
        typeof this.handleFetchFeed.cancel === 'function'
      )
        this.handleFetchFeed.cancel();
    });
    window.addEventListener('online', () => {
      this.handleFetchFeed();
    });

    this.handleFetchFeed = debounce(this.handleFetchFeed, 521);
    this.handleFetchUserClasses();
    await this.handleFetchFeed();
  };

  componentWillUnmount = () => {
    this.mounted = false;
    if (
      this.handleFetchFeed.cancel &&
      typeof this.handleFetchFeed.cancel === 'function'
    )
      this.handleFetchFeed.cancel();
  };

  handleFetchUserClasses = () => {
    const {
      user: {
        data: { userId, segment }
      }
    } = this.props;

    getUserClasses({ userId }).then(({ classes }) => {
      const classesList = processUserClasses({ classes, segment });
      if (this.mounted) this.setState({ classesList });
    });
  };

  handleFetchFeed = () => {
    const {
      user: {
        data: { userId, schoolId }
      },
      fetchFeed
    } = this.props;
    const { from, userClass, postType, limit, query } = this.state;

    const { classId, sectionId } = JSON.parse(userClass);
    try {
      fetchFeed({
        userId,
        schoolId,
        classId,
        sectionId,
        index: 0,
        limit,
        postType,
        from,
        query
      })
    } catch (err) {
      console.log(err);
    }
  };

  handleShare = ({ feedId }: { feedId: number }) => {
    this.setState({ feedId });
  };

  handleShareClose = () => {
    this.setState({ feedId: null });
  };

  handleBookmark = ({
    feedId,
    bookmarked
  }: {
    feedId: number,
    bookmarked: boolean
  }) => {
    const {
      user: {
        data: { userId }
      },
      updateBookmark
    } = this.props;

    updateBookmark({ feedId, userId, bookmarked });
  };

  handleReport = ({ feedId, ownerId }) => {
    this.setState({ report: { feedId, ownerId } });
  };

  handleReportClose = () => {
    this.setState({ report: null });
  };

  handleDelete = ({ feedId }) => {
    this.setState({ deletePost: { feedId } });
  };

  handleDeleteClose = ({ deleted }: { deleted?: boolean }) => {
    // update feed list
    if (deleted && deleted === true) {
      this.handleFetchFeed();
    }
    this.setState({ deletePost: null });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value, limit: 100 });
    this.handleFetchFeed();
    if (name === 'query') {
      logEvent({
        event: 'Feed- Start Search',
        props: { Query: event.target.value }
      });
    }
  };

  handleClearFilters = () => {
    this.setState({
      from: 'everyone',
      userClass: defaultClass,
      postType: 0,
      limit: 100
    });
    this.handleFetchFeed();
  };

  handleLoadMore = () => {
    this.setState(({ limit }) => ({ limit: limit + 100 }));
    this.handleFetchFeed();
  };

  handleUserClick = ({ userId }: { userId: string }) => {
    const { push } = this.props;
    push(`/profile/${userId}`);
  };

  handleOpenFilter = () => {
    logEvent({
      event: 'Feed- Open Filter',
      props: {}
    });
  };

  handleRefresh = () => {
    this.handleFetchFeed();
  };

  handlePostClick = ({
    typeId,
    postId,
    feedId
  }: {
    typeId: number,
    postId: number,
    feedId: number
  }) => () => {
    const { push } = this.props;
    push(`/feed?id=${feedId}`);
    switch (typeId) {
      case 3:
        push(`/flashcards/${postId}`);
        break;
      case 4:
        push(`/notes/${postId}`);
        break;
      case 5:
        push(`/sharelink/${postId}`);
        break;
      case 6:
        push(`/question/${postId}`);
        break;
      default:
        break;
    }
  };

  mounted: boolean;

  render() {
    const {
      classes,
      user: {
        data: { userId }
      },
      feed: {
        data: { items, hasMore },
        isLoading
      },
      feedId: fromFeedId
    } = this.props;
    const {
      feedId,
      report,
      deletePost,
      query,
      from,
      userClass,
      postType,
      classesList
    } = this.state;

    return (
      <Fragment>
        <ErrorBoundary>
          <div className={classes.root}>
            <FeedList
              isLoading={isLoading}
              userId={userId}
              items={items}
              query={query}
              from={from}
              userClass={userClass}
              defaultClass={defaultClass}
              postType={postType}
              classesList={classesList}
              hasMore={hasMore}
              fromFeedId={fromFeedId}
              handleShare={this.handleShare}
              onPostClick={this.handlePostClick}
              onBookmark={this.handleBookmark}
              onReport={this.handleReport}
              onDelete={this.handleDelete}
              onChange={this.handleChange}
              onClearFilters={this.handleClearFilters}
              onLoadMore={this.handleLoadMore}
              onUserClick={this.handleUserClick}
              onOpenFilter={this.handleOpenFilter}
              onRefresh={this.handleRefresh}
            />
          </div>
        </ErrorBoundary>
        <ErrorBoundary>
          <SharePost
            feedId={feedId}
            open={Boolean(feedId)}
            onClose={this.handleShareClose}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <Report
            open={Boolean(report)}
            ownerId={(report || {}).ownerId || ''}
            objectId={(report || {}).feedId || -1}
            onClose={this.handleReportClose}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <DeletePost
            open={Boolean(deletePost)}
            feedId={(deletePost || {}).feedId || -1}
            onClose={this.handleDeleteClose}
          />
        </ErrorBoundary>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ user, feed }: StoreState): {} => ({
  user,
  feed
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      push: routePush,
      fetchFeed: feedActions.fetchFeed,
      updateBookmark: feedActions.updateBookmark
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Feed));
