import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useStyles from './styles';
import { useParams } from 'react-router';
import withRoot from '../../withRoot';
import Grid from '@material-ui/core/Grid';
import { getFlashcards } from '../../api/posts';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import LoadingSpin from '../../components/LoadingSpin';
import Avatar from '../../components/Avatar';
import _ from 'lodash';
import Chip from '@material-ui/core/Chip';
import IconPen from '@material-ui/icons/EditOutlined';
import IconActionButton from '../../components/IconActionButton';
import IconBookmark from '@material-ui/icons/BookmarkOutlined';
import IconShare from '@material-ui/icons/ShareOutlined';
import IconSchool from '@material-ui/icons/School';
import Link from '@material-ui/core/Link';
import ActionButton from './ActionButton';
import CardBoard from './CardBoard';
import LinearProgressBar from '../../components/LinearProgressBar';
import IconPrevious from '@material-ui/icons/ArrowBack';
import IconNext from '@material-ui/icons/ArrowForward';
import TransparentIconButton from '../../components/Basic/Buttons/TransparentIconButton';
import FlashcardsListEditor from '../../components/FlashcardsListEditor';
import { bookmarkFlashcards } from '../../actions/user';
import update from 'immutability-helper';
import clsx from 'clsx';
import { isApiCalling } from '../../utils/helpers';
import { userActions } from '../../constants/action-types';
import ShareLinkModal from '../../components/ShareLinkModal';
import { APP_ROOT_PATH } from '../../constants/app';
import Dialog from '../../components/Dialog';
import FlashcardsDeckEditor from '../../components/FlashcardsDeckManager/FlashcardsDeckEditor';
import SlideUp from '../../components/Transition/SlideUp';
import FlashcardsReview from '../../components/FlashcardsReview';

const DESCRIPTION_LENGTH_THRESHOLD = 50;

const FlashcardsShow = () => {
  // Hooks
  const classes = useStyles();
  const dispatch = useDispatch();
  const { flashcardId } = useParams();
  const me = useSelector((state) => state.user.data);
  const isBookmarking = useSelector(isApiCalling(userActions.BOOKMARK_FLASHCARDS));

  // States
  const [data, setData] = useState({});
  const [isLoadingFlashcards, setIsLoadingFlashcards] = useState(false);
  const [isShortSummary, setIsShortSummary] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [boardDeckIndex, setBoardDeckIndex] = useState(0);

  // Memos
  const cardList = useMemo(() => {
    return (data.deck || []).map((item) => ({
      id: item.id,
      question: item.question,
      questionImage: item.question_image_url,
      answer: item.answer,
      answerImage: item.answer_image_url
    }));
  }, [data.deck]);

  const deckData = useMemo(() => {
    return {
      title: data.title,
      summary: data.summary,
      classId: data.classId,
      sectionId: data.sectionId,
      deck: cardList
    };
  }, [data, cardList]);

  // Callbacks
  const reloadData = useCallback(() => {
    setIsLoadingFlashcards(true);
    getFlashcards({
      flashcardId,
      userId: me.userId
    }).then((rsp) => {
      setData(rsp);
      setIsLoadingFlashcards(false);
    });
  }, [flashcardId, setData, setIsLoadingFlashcards, me.userId]);

  // Effects
  useEffect(() => reloadData(), [reloadData]);

  // Event Handlers
  const handleActionEdit = useCallback(() => {
    setIsEditing(true);
  }, [setIsEditing]);

  const handleActionBookmark = useCallback(() => {
    dispatch(
      bookmarkFlashcards(
        me.userId,
        data.feedId,
        data.bookmarked,
        () => setData(update(data, {
          bookmarked: { $set: !data.bookmarked }
        }))
      )
    )
  }, [dispatch, data, setData, me.userId]);

  const handleActionShare = useCallback(() => {
    setIsShareModalOpen(true);
  }, [setIsShareModalOpen]);

  // const handleActionMore = useCallback(() => {
  //
  // }, []);

  const handleSummaryMoreOrLess = useCallback(() => {
    setIsShortSummary(!isShortSummary);
  }, [isShortSummary, setIsShortSummary]);

  const handlePrevDeck = useCallback(() => {
    setBoardDeckIndex(boardDeckIndex - 1);
  }, [boardDeckIndex, setBoardDeckIndex]);

  const handleNextDeck = useCallback(() => {
    setBoardDeckIndex(boardDeckIndex + 1);
  }, [boardDeckIndex, setBoardDeckIndex]);

  const handleCloseShareLinkModal = useCallback(() => {
    setIsShareModalOpen(false);
  }, [setIsShareModalOpen]);

  const handleCloseEditModal = useCallback(() => {
    setIsEditing(false);
  }, [setIsEditing]);

  const handleEditFinish = useCallback(() => {
    handleCloseEditModal();
    reloadData();
  }, [reloadData, handleCloseEditModal]);

  const handleReview = useCallback(() => {
    setIsReviewing(true);
  }, [setIsReviewing]);

  const handleCloseReviewModal = useCallback(() => {
    setIsReviewing(false);
  }, [setIsReviewing]);

  // Rendering
  if (_.isEmpty(data) || isLoadingFlashcards) return <LoadingSpin />;


  return (
    <div className={classes.container}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} lg={8}>
          <Typography variant="h4" gutterBottom>
            { data.title }
          </Typography>
          <Typography variant="body2" gutterBottom paragraph>
            { isShortSummary ?
              _.truncate(data.summary, { length: 50 })
              :
              data.summary
            }
            { data.summary.length > DESCRIPTION_LENGTH_THRESHOLD && (
              <Link
                className={classes.moreLessLink}
                onClick={handleSummaryMoreOrLess}
                color="inherit"
                underline="always">
                { isShortSummary ? 'see more' : 'show less' }
              </Link>
            )}
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar
                initialText={data.name}
                src={data.userProfileUrl}
                desktopSize={45}
                mobileSize={45}
              />
            </Grid>
            <Grid item>
              <Box fontSize={18} fontWeight={800}>
                { data.name }
              </Box>
            </Grid>
            <Grid item>
              <Chip
                color="primary"
                label={data.courseDisplayName}
                style={{
                  color: 'white'
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Grid container spacing={2}>
            { me.userId === data.userId && (
              <Grid item>
                <IconActionButton onClick={handleActionEdit}>
                  <IconPen />
                </IconActionButton>
              </Grid>
            )}
            <Grid item>
              <IconActionButton
                className={clsx(data.bookmarked && 'active')}
                onClick={handleActionBookmark}
                disabled={isBookmarking}
                loading={isBookmarking}
              >
                <IconBookmark />
              </IconActionButton>
            </Grid>
            <Grid item>
              <IconActionButton onClick={handleActionShare}>
                <IconShare />
              </IconActionButton>
            </Grid>
            {/*<Grid item>*/}
            {/*  <IconActionButton onClick={handleActionMore}>*/}
            {/*    <IconMore />*/}
            {/*  </IconActionButton>*/}
            {/*</Grid>*/}
          </Grid>
        </Grid>
      </Grid>
      <Box mt={3} />
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <CardBoard data={data.deck[boardDeckIndex]} />
          <Box mt={2} display="flex" justifyContent="center" alignItems="center">
            <Box mr={2}>
              <TransparentIconButton
                disabled={boardDeckIndex === 0}
                onClick={handlePrevDeck}
              >
                <IconPrevious />
              </TransparentIconButton>
            </Box>
            <LinearProgressBar
              value={boardDeckIndex + 1}
              totalValue={data.deck.length}
            />
            <Box ml={2}>
              <TransparentIconButton
                disabled={boardDeckIndex === data.deck.length - 1}
                onClick={handleNextDeck}
              >
                <IconNext />
              </TransparentIconButton>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Box fontSize={18} fontWeight={800}>
            Practice Mode
          </Box>
          <Box mt={3}>
            <ActionButton startIcon={<IconSchool />} onClick={handleReview}>
              Review Time
            </ActionButton>
          </Box>
          {/*<Box mt={3}>*/}
          {/*  <ActionButton startIcon={<IconBook />}>*/}
          {/*    Quiz Yourself*/}
          {/*  </ActionButton>*/}
          {/*</Box>*/}
        </Grid>
      </Grid>
      <Box mt={3} mb={3}>
        <Typography variant="h6">
          { `List of Flashcards in ${me.userId === data.userId ? 'Your' : `${data.name}'s`} Deck (${data.deck.length})` }
        </Typography>
      </Box>
      <FlashcardsListEditor
        data={cardList}
        readOnly={true}
      />

      { /* Modals for the page */ }

      <ShareLinkModal
        open={isShareModalOpen}
        link={`${APP_ROOT_PATH}/flashcards/${data.postId}`}
        title={(
          <Typography variant="h6">
            <span role="img" aria-label="Two hands">🙌</span>
            &nbsp; You’re awesome for helping your peers! Ready to share a link to your <b>{ data.title }</b> deck?
          </Typography>
        )}
        onClose={handleCloseShareLinkModal}
      />

      <Dialog
        fullScreen
        open={isEditing}
        onCancel={handleCloseEditModal}
        TransitionComponent={SlideUp}
      >
        <FlashcardsDeckEditor
          flashcardId={data.postId}
          data={deckData}
          onAfterUpdate={handleEditFinish}
        />
      </Dialog>

      <Dialog
        fullScreen
        className={classes.reviewModal}
        contentClassName={classes.reviewModalContent}
        open={isReviewing}
        onCancel={handleCloseReviewModal}
        showHeader={false}
        TransitionComponent={SlideUp}
      >
        <FlashcardsReview
          flashcardId={data.postId}
          cards={cardList}
          onClose={handleCloseReviewModal}
        />
      </Dialog>
    </div>
  );
};

export default withRoot(FlashcardsShow);
