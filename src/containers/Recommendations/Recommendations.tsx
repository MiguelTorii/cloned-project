import React, { useCallback, useEffect, useState } from "react";
import { Grid, Paper, Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import update from "immutability-helper";
import withRoot from "../../withRoot";
import { fetchRecommendations } from "../../api/feed";
import FeedItem from "../../components/FeedList/FeedItem";
import useStyles from "./styles";
import SharePost from "../SharePost/SharePost";
import { POST_TYPES } from "../../constants/app";
import { updateBookmark } from "../../actions/feed";
import DeletePost from "../DeletePost/DeletePost";
import Report from "../../components/Report/ReportIssue";
import { PROFILE_PAGE_SOURCE } from "../../constants/common";
import { buildPath } from "../../utils/helpers";

const Recommendations = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const me = useSelector(state => state.user.data);
  const [posts, setPosts] = useState([]);
  const newClassExperience = useSelector(state => state.campaign.newClassExperience);
  const [shareFeedId, setShareFeedId] = useState(null);
  const [deleteFeedId, setDeleteFeedId] = useState(null);
  const [reportData, setReportData] = useState(null);
  // Callbacks
  const loadRecommendations = useCallback(() => {
    fetchRecommendations(5).then(data => {
      setPosts(data); // setLoading(false);
    });
  }, []);
  const handleShare = useCallback(({
    feedId
  }) => {
    setShareFeedId(feedId);
  }, []);
  const handleShareClose = useCallback(() => {
    setShareFeedId(null);
  }, []);
  const handlePostClick = useCallback(({
    postId,
    typeId
  }) => () => {
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

    url = `${url}?from=recommendation`;
    dispatch(push(url));
  }, [dispatch]);
  const handleUserClick = useCallback(({
    userId
  }) => {
    dispatch(push(buildPath(`/profile/${userId}`, {
      from: PROFILE_PAGE_SOURCE.POST
    })));
  }, [dispatch]);
  const handleBookmark = useCallback(({
    feedId,
    bookmarked
  }) => {
    dispatch(updateBookmark({
      userId: me.userId,
      feedId,
      bookmarked
    })).then(() => {
      const feedIndex = posts.findIndex(feed => feed.feedId === feedId);

      if (feedIndex < 0) {
        throw new Error('feed should exist');
      }

      setPosts(update(posts, {
        [feedIndex]: {
          bookmarked: {
            $set: !bookmarked
          }
        }
      }));
    });
  }, [dispatch, me.userId, posts]);
  const handlePushTo = useCallback(url => dispatch(push(url)), [dispatch]);
  const handleDelete = useCallback(({
    feedId
  }) => {
    setDeleteFeedId(feedId);
  }, []);
  const handleDeleteClose = useCallback(({
    deleted
  }) => {
    if (deleted === true) {
      loadRecommendations();
    }

    setDeleteFeedId(null);
  }, [loadRecommendations]);
  const handleReport = useCallback(({
    feedId,
    ownerId,
    ownerName
  }) => {
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

  return <>
      <Grid container direction="column" spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Posts Recommended For You</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container direction="column" spacing={3}>
            {posts.map(post => <Grid key={post.postId} item xs={12}>
                <Paper elevation={0} className={classes.postContainer}>
                  <FeedItem data={post} showComments={false} newClassExperience={newClassExperience} showSimple handleShareClick={handleShare} onBookmark={handleBookmark} onPostClick={handlePostClick} onUserClick={handleUserClick} pushTo={handlePushTo} onDelete={handleDelete} onReport={handleReport} />
                </Paper>
              </Grid>)}
          </Grid>
        </Grid>
      </Grid>
      <SharePost feedId={shareFeedId} open={Boolean(shareFeedId)} onClose={handleShareClose} />
      <DeletePost open={Boolean(deleteFeedId)} feedId={deleteFeedId || -1} onClose={handleDeleteClose} />
      <Report open={Boolean(reportData)} ownerId={reportData?.ownerId || ''} ownerName={reportData?.ownerName || ''} objectId={reportData?.feedId || -1} onClose={handleReportClose} />
    </>;
};

export default withRoot(Recommendations);