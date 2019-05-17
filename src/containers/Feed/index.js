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
import SharePost from '../SharePost';
import Report from '../Report';
import DeletePost from '../DeletePost';
import { processUserClasses } from './utils';

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
    limit: 50,
    hasMore: false
  };

  componentDidMount = async () => {
    this.handleFetchFeed = debounce(this.handleFetchFeed, 500);
    this.handleFetchUserClasses();
    await this.handleFetchFeed();
  };

  handleFetchUserClasses = () => {
    const {
      user: {
        data: { userId, segment }
      }
    } = this.props;

    getUserClasses({ userId }).then(classes => {
      const classesList = processUserClasses({ classes, segment });
      this.setState({ classesList });
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
    this.setState({ loading: true });
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
      this.setState(({ feed }) => ({
        feed: newFeed,
        hasMore:
          newFeed.length === 50 ||
          (feed[feed.length - 1] || {}).feedId !==
            (newFeed[newFeed.length - 1] || {}).feedId
      }));
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ loading: false });
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

  handleDeleteClose = () => {
    // update feed list
    this.setState({ deletePost: null });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value, limit: 50 });
    this.handleFetchFeed();
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

  handlePostClick = (typeId: number, postId: number) => () => {
    const { push } = this.props;

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

  render() {
    const {
      classes,
      user: {
        data: { userId }
      }
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
            handleShare={this.handleShare}
            handlePostClick={this.handlePostClick}
            onBookmark={this.handleBookmark}
            onReport={this.handleReport}
            onDelete={this.handleDelete}
            onChange={this.handleChange}
            onClearFilters={this.handleClearFilters}
            onLoadMore={this.handleLoadMore}
          />
        </div>
        <SharePost
          feedId={feedId}
          open={Boolean(feedId)}
          onClose={this.handleShareClose}
        />
        <Report
          open={Boolean(report)}
          ownerId={(report || {}).ownerId || ''}
          objectId={(report || {}).feedId || -1}
          onClose={this.handleReportClose}
        />
        <DeletePost
          open={Boolean(deletePost)}
          feedId={(deletePost || {}).feedId || -1}
          onClose={this.handleDeleteClose}
        />
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
