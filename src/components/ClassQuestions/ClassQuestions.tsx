import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Grid, Paper, Typography } from '@material-ui/core';

import { POST_TYPES } from 'constants/app';
import { PROFILE_PAGE_SOURCE } from 'constants/common';
import { cypherClass } from 'utils/crypto';
import { buildPath } from 'utils/helpers';

import { updateBookmark } from 'actions/feed';
import { fetchFeed } from 'api/feed';
import ImageEmpty from 'assets/svg/class-question-empty.svg';
import DeletePost from 'containers/DeletePost/DeletePost';
import Report from 'containers/Report/Report';
import SharePost from 'containers/SharePost/SharePost';

import GradientButton from '../Basic/Buttons/GradientButton';
import FeedItem from '../FeedList/FeedItem';
import LoadingSpin from '../LoadingSpin/LoadingSpin';

import useStyles from './styles';

type Props = {
  classId: number;
};

const ClassQuestions = ({ classId }: Props) => {
  const classes: any = useStyles();
  const dispatch = useDispatch();
  const me = useSelector((state) => (state as any).user.data);
  const myClasses = useSelector((state) => (state as any).user.userClasses.classList);
  const isExpertMode = useSelector((state) => (state as any).user.expertMode);
  const [loading, setLoading] = useState(true);
  const [feedList, setFeedList] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [shareData, setShareData] = useState(null);
  const classData = useMemo(() => {
    if (!classId) {
      return null;
    }

    return myClasses.find((item) => item.classId === classId);
  }, [myClasses, classId]);
  useEffect(() => {
    const classes = (classData?.section || []).map((section) =>
      JSON.stringify({
        sectionId: section.sectionId
      })
    );
    setLoading(true);
    fetchFeed({
      userId: me.userId,
      schoolId: me.schoolId,
      userClasses: classes,
      index: 0,
      limit: 3,
      postTypes: [String(POST_TYPES.QUESTION)],
      query: ''
    }).then((data) => {
      setFeedList(data);
      setLoading(false);
    });
  }, [classData, me.userId, me.schoolId]);
  const handleBookmark = useCallback(
    ({ feedId, bookmarked }) => {
      dispatch(
        updateBookmark({
          feedId,
          bookmarked,
          userId: me.userId
        })
      );
      setFeedList((data) =>
        data.map((item) => {
          if (item.feedId !== feedId) {
            return item;
          }

          return { ...item, bookmarked: !bookmarked };
        })
      );
    },
    [me.userId, dispatch]
  );
  const handleShare = useCallback(({ feedId }) => {
    setShareData({
      feedId
    });
  }, []);
  const handleShareClose = useCallback(() => {
    setShareData(null);
  }, []);
  const handleDelete = useCallback(({ feedId }) => {
    setDeleteData({
      feedId
    });
  }, []);
  const handleDeleteClose = useCallback(
    ({ deleted }) => {
      if (deleted) {
        setFeedList((data) => data.filter((item) => item.feedId !== deleteData.feedId));
      }

      setDeleteData(null);
    },
    [deleteData]
  );
  const handleReport = useCallback(({ feedId, ownerId }) => {
    setReportData({
      feedId,
      ownerId
    });
  }, []);
  const handleReportClose = useCallback(() => {
    setReportData(null);
  }, []);
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
  const handlePostClick = useCallback(
    ({ typeId, postId }) =>
      () => {
        let url = '';

        switch (typeId) {
          case 3:
            url = `/flashcards/${postId}`;
            break;

          case 4:
            url = `/notes/${postId}`;
            break;

          case 5:
            url = `/sharelink/${postId}`;
            break;

          case 6:
            url = `/question/${postId}`;
            break;

          case 8:
            url = `/post/${postId}`;
            break;

          default:
            throw new Error('unknown post type');
        }

        dispatch(push(url));
      },
    [dispatch]
  );
  const handleGoToFeed = useCallback(() => {
    if (!classData) {
      dispatch(push(`/feed`));
      return;
    }

    const queryString = cypherClass({
      classId: classData.classId as number,
      sectionId: classData.section?.[0].sectionId as number
    });
    dispatch(push(`/feed?class=${queryString}`));
  }, [dispatch, classData]);
  const handleAskQuestion = useCallback(() => {
    dispatch(push(`/create_post?tab=1`));
  }, [dispatch]);

  if (loading) {
    return <LoadingSpin />;
  }

  if (feedList.length === 0) {
    return (
      <>
        <Box display="flex" justifyContent="center" mb={2}>
          <img src={ImageEmpty} alt="empty state" />
        </Box>
        <Typography align="center" gutterBottom>
          No questions yet
        </Typography>
        <Typography variant="body2" paragraph>
          When a question gets asked in this class, they???ll show up here. Click the button below to
          ask a question in this class!
        </Typography>
        <Box display="flex" justifyContent="center">
          <GradientButton onClick={handleAskQuestion}>Ask a Question</GradientButton>
        </Box>
      </>
    );
  }

  return (
    <>
      <Grid container direction="column" spacing={3}>
        {feedList.map((item) => (
          <Grid item key={item.feedId}>
            <Paper elevation={0} square={false} className={classes.feedContainer}>
              <FeedItem
                expertMode={isExpertMode}
                userId={me.userId}
                schoolId={me.schoolId}
                data={item}
                handleShareClick={handleShare}
                onPostClick={handlePostClick}
                onBookmark={handleBookmark}
                onReport={handleReport}
                onDelete={handleDelete}
                onUserClick={handleUserClick}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Box display="flex" justifyContent="center" mt={3}>
        <GradientButton onClick={handleGoToFeed}>Go to Feed</GradientButton>
      </Box>
      <DeletePost
        open={Boolean(deleteData)}
        feedId={(deleteData || {}).feedId || -1}
        onClose={handleDeleteClose}
      />
      <Report
        open={Boolean(reportData)}
        ownerId={(reportData || {}).ownerId || ''}
        objectId={(reportData || {}).feedId || -1}
        onClose={handleReportClose}
      />
      <SharePost
        feedId={shareData?.feedId || 0}
        open={Boolean(shareData)}
        onClose={handleShareClose}
      />
    </>
  );
};

ClassQuestions.propTypes = {
  classId: PropTypes.number
};
ClassQuestions.defaultProps = {
  classId: null
};
export default ClassQuestions;
