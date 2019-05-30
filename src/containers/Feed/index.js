// @flow

import React, { Fragment } from 'react';
import debounce from 'lodash/debounce';
import update from 'immutability-helper';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push as routePush } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import FeedList from '../../components/FeedList';
import type { State as StoreState } from '../../types/state';
import type { UserState } from '../../reducers/user';
import { fetchFeed } from '../../api/feed';
import { bookmark } from '../../api/posts';
import { getUserClasses } from '../../api/user';
import { logEvent } from '../../api/analytics';
import SharePost from '../SharePost';
import Report from '../Report';
import DeletePost from '../DeletePost';
import { processUserClasses } from './utils';
import ErrorBoundary from '../ErrorBoundary';

const defaultClass = JSON.stringify({ classId: 0, sectionId: 0 });

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
  feedId: ?number,
  push: Function
};

type State = {
  feed: Array<Object>,
  feedId: ?number,
  loading: boolean,
  report: ?Object,
  deletePost: ?Object,
  from: string,
  userClass: string,
  postType: number,
  classesList: Array<{ value: string, label: string }>,
  query: string,
  limit: number,
  hasMore: boolean
};

class Feed extends React.PureComponent<Props, State> {
  state = {
    feed: [],
    feedId: null,
    loading: false,
    report: null,
    deletePost: null,
    from: 'everyone',
    userClass: defaultClass,
    postType: 0,
    classesList: [],
    query: '',
    limit: 100,
    hasMore: false
  };

  componentDidMount = async () => {
    this.mounted = true;
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
    this.mounted = false
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
      if(this.mounted) this.setState({ classesList });
    });
  };

  handleFetchFeed = async () => {
    const {
      user: {
        data: { userId, schoolId }
      }
    } = this.props;
    const { from, userClass, postType, query, limit } = this.state;
    const { classId, sectionId } = JSON.parse(userClass);
    if(this.mounted) this.setState({ loading: true });
    try {
      const newFeed = await fetchFeed({
        userId,
        schoolId,
        classId,
        sectionId,
        index: 0,
        limit,
        postType,
        from,
        query
      });
      if(this.mounted) this.setState(({ feed }) => ({
        feed: newFeed,
        hasMore:
          newFeed.length === 50 ||
          (feed[feed.length - 1] || {}).feedId !==
            (newFeed[newFeed.length - 1] || {}).feedId
      }));
    } catch (err) {
      console.log(err);
    } finally {
      if(this.mounted) this.setState({ loading: false });
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
      }
    } = this.props;
    bookmark({ feedId, userId, remove: bookmarked });
    const newState = update(this.state, {
      feed: {
        $apply: b => {
          const index = b.findIndex(item => item.feedId === feedId);
          if (index > -1) {
            return update(b, {
              [index]: {
                bookmarked: { $set: !bookmarked }
              }
            });
          }
          return b;
        }
      }
    });

    this.setState(newState);
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
    this.setState({ [name]: event.target.value, limit: 50 });
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
      limit: 50
    });
    this.handleFetchFeed();
  };

  handleLoadMore = () => {
    this.setState(({ limit }) => ({ limit: limit + 50 }));
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

  mounted: boolean

  render() {
    const {
      classes,
      user: {
        data: { userId }
      },
      feedId: fromFeedId
    } = this.props;
    const {
      feed,
      feedId,
      loading,
      report,
      deletePost,
      query,
      from,
      userClass,
      postType,
      classesList,
      hasMore
    } = this.state;

    return (
      <Fragment>
        <ErrorBoundary>
          <div className={classes.root}>
            <FeedList
              isLoading={loading}
              userId={userId}
              items={feed}
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

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      push: routePush
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Feed));
