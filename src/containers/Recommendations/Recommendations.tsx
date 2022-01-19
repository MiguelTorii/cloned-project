import React, { useCallback, useEffect, useState } from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import update from 'immutability-helper';
import { v4 as uuidv4 } from 'uuid';
import { PROFILE_PAGE_SOURCE, RECOMMENDATION_FETCH_UNIT } from 'constants/common';
import withRoot from '../../withRoot';
import { fetchRecommendations } from '../../api/feed';
import FeedItem from '../../components/FeedList/FeedItem';
import useStyles from './styles';
import SharePost from '../SharePost/SharePost';
import { EVENT_TYPES, LOG_EVENT_CATEGORIES, POST_TYPES } from '../../constants/app';
import { updateBookmark } from '../../actions/feed';
import DeletePost from '../DeletePost/DeletePost';
import { buildPath } from '../../utils/helpers';
import ReportIssue from '../../components/Report/ReportIssue';
import { PROFILE_SOURCE_KEY } from '../../routeConstants';
import { logEventLocally } from '../../api/analytics';

const Recommendations = () => {
  const classes: any = useStyles();
  const dispatch = useDispatch();
  const me = useSelector((state) => (state as any).user.data);
  const [posts, setPosts] = useState([]);
  const newClassExperience = useSelector((state) => (state as any).campaign.newClassExperience);
  const [shareFeedId, setShareFeedId] = useState(null);
  const [deleteFeedId, setDeleteFeedId] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [requestId, setRequestId] = useState(null);

  // Callbacks
  const loadRecommendations = useCallback(() => {
    const newRequestId = uuidv4();
    setRequestId(newRequestId);
    fetchRecommendations(RECOMMENDATION_FETCH_UNIT, newRequestId).then((data) => {
      setPosts(data);
    });
  }, []);
  const handleShare = useCallback(({ feedId }) => {
    setShareFeedId(feedId);
  }, []);
  const handleShareClose = useCallback(() => {
    setShareFeedId(null);
  }, []);
  const handlePostClick = useCallback(
    ({ postId, feedId, typeId }) =>
      () => {
        let url = '';

        switch (typeId) {
          case POST_TYPES.FLASHCARDS:
            url = `/flashcards/${postId}`;
            break;

          case POST_TYPES.NOTE:
            url = `/notes/${postId}`;
            break;

          case POST_TYPES.LINK:
            url = `/sharelink/${postId}`;
            break;

          case POST_TYPES.QUESTION:
            url = `/question/${postId}`;
            break;

          case POST_TYPES.POST:
            url = `/post/${postId}`;
            break;

          default:
            throw new Error('unknown feed type');
        }

        logEventLocally({
          category: LOG_EVENT_CATEGORIES.POST,
          type: EVENT_TYPES.CLICKED_RECOMMENDED,
          objectId: feedId,
          feed_id: feedId,
          request_id: requestId
        });

        url = `${url}?${PROFILE_SOURCE_KEY}=recommendation`;
        dispatch(push(url));
      },
    [dispatch, requestId]
  );
  const handleUserClick = useCallback(
    ({ userId }) => {
      dispatch(
        push(
          buildPath(`/profile/${userId}`, {
            from: PROFILE_PAGE_SOURCE.POST
          })
        )
      );
    },
    [dispatch]
  );
  const handleBookmark = useCallback(
    ({ feedId, bookmarked }) => {
      // TODO dispatch doesn't return a promise,
      // so I'm not seeing how this then call could possibly work.
      // This will need more investigation.
      (
        dispatch(
          updateBookmark({
            userId: me.userId,
            feedId,
            bookmarked
          })
        ) as any
      ).then(() => {
        const feedIndex = posts.findIndex((feed) => feed.feedId === feedId);

        if (feedIndex < 0) {
          throw new Error('feed should exist');
        }

        setPosts(
          update(posts, {
            [feedIndex]: {
              bookmarked: {
                $set: !bookmarked
              }
            }
          })
        );
      });
    },
    [dispatch, me.userId, posts]
  );
  const handlePushTo = useCallback((url) => dispatch(push(url)), [dispatch]);
  const handleDelete = useCallback(({ feedId }) => {
    setDeleteFeedId(feedId);
  }, []);
  const handleDeleteClose = useCallback(
    ({ deleted }) => {
      if (deleted === true) {
        loadRecommendations();
      }

      setDeleteFeedId(null);
    },
    [loadRecommendations]
  );
  const handleReport = useCallback(({ feedId, ownerId, ownerName }) => {
    setReportData({
      feedId,
      ownerId,
      ownerName
    });
  }, []);
  const handleReportClose = useCallback(() => {
    setReportData(null);
  }, []);
  // Effects
  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  if (posts.length === 0) {
    return null;
  }

  return (
    <>
      <Grid container direction="column" spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Posts Recommended For You</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container direction="column" spacing={3}>
            {posts.map((post) => (
              <Grid key={post.postId} item xs={12}>
                <Paper elevation={0} className={classes.postContainer}>
                  <FeedItem
                    data={post}
                    showComments={false}
                    newClassExperience={newClassExperience}
                    showSimple
                    handleShareClick={handleShare}
                    onBookmark={handleBookmark}
                    onPostClick={handlePostClick}
                    onUserClick={handleUserClick}
                    pushTo={handlePushTo}
                    onDelete={handleDelete}
                    onReport={handleReport}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <SharePost feedId={shareFeedId} open={Boolean(shareFeedId)} onClose={handleShareClose} />
      <DeletePost
        open={Boolean(deleteFeedId)}
        feedId={deleteFeedId || -1}
        onClose={handleDeleteClose}
      />
      <ReportIssue
        open={Boolean(reportData)}
        ownerId={reportData?.ownerId || ''}
        ownerName={reportData?.ownerName || ''}
        objectId={reportData?.feedId || -1}
        onClose={handleReportClose}
      />
    </>
  );
};

export default withRoot(Recommendations);
