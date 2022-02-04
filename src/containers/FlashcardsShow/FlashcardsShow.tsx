/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import _ from 'lodash';
import clsx from 'clsx';
import moment from 'moment';
import update from 'immutability-helper';
import { push, goBack } from 'connected-react-router';
import { useLocation, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useLastLocation } from 'react-router-last-location';
import { useIdleTimer } from 'react-idle-timer';
import { differenceInMilliseconds } from 'date-fns';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import IconSchool from '@material-ui/icons/School';
import IconPrevious from '@material-ui/icons/ArrowBack';
import IconNext from '@material-ui/icons/ArrowForward';
import IconPen from '@material-ui/icons/EditOutlined';
import IconBookmark from '@material-ui/icons/BookmarkOutlined';
import IconBookmarkBorder from '@material-ui/icons/BookmarkBorder';
import IconShare from '@material-ui/icons/ShareOutlined';
import IconBook from '@material-ui/icons/Book';
import IconNote from '@material-ui/icons/LibraryBooks';
import IconBack from '@material-ui/icons/ArrowBackIos';
import Link from '@material-ui/core/Link';
import { useHotkeys } from 'react-hotkeys-hook';

import Avatar from 'components/Avatar';
import { getFlashcards } from '../../api/posts';
import { logEvent } from '../../api/analytics';
import { bookmarkFlashcards } from '../../actions/user';
import { PROFILE_PAGE_SOURCE, TIMEOUT } from '../../constants/common';
import { INTERVAL, APP_ROOT_PATH } from '../../constants/app';
import { userActions } from '../../constants/action-types';
import PostComments from '../PostComments/ViewNotes';
import PostItemActions from '../PostItemActions/PostItemActions';
import LoadingSpin from '../../components/LoadingSpin/LoadingSpin';
import LinearProgressBar from '../../components/LinearProgressBar/LinearProgressBar';
import IconActionButton from '../../components/IconActionButton/IconActionButton';
import TransparentIconButton from '../../components/Basic/Buttons/TransparentIconButton';
import FlashcardsListEditor from '../../components/FlashcardsListEditor/FlashcardsListEditor';
import FlashcardsMatchGame from '../../components/FlashcardsMatchGame/FlashcardsMatchGame';
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop';
import ShareLinkModal from '../../components/ShareLinkModal/ShareLinkModal';
import Dialog from '../../components/Dialog/Dialog';
import FlashcardsDeckEditor from '../../components/FlashcardsDeckManager/FlashcardsDeckEditor';
import SlideUp from '../../components/Transition/SlideUp';
import FlashcardsReview from '../../components/FlashcardsReview/FlashcardsReview';
import FlashcardsQuiz from '../../components/FlashcardsQuiz/FlashcardsQuiz';
import PostItem from '../../components/PostItem/PostItem';
import PostItemHeader from '../../components/PostItem/PostItemHeader';
import { isApiCalling, getPastClassIds, buildPath } from '../../utils/helpers';
import { getInitials } from '../../utils/chat';
import PostTags from '../PostTags/PostTags';
import ActionButton from './ActionButton';
import CardBoard from './CardBoard';
import useStyles from './styles';
import Report from '../Report/Report';
import DeletePost from '../DeletePost/DeletePost';
import HotKeyGuide from '../../components/HotKeyGuide/HotKeyGuide';

const DESCRIPTION_LENGTH_THRESHOLD = 80;
const timeout = TIMEOUT.FLASHCARD_REVEIW;

const HOT_KEYS = [
  {
    description: 'Previous',
    keys: ['⇨']
  },
  {
    description: 'Next',
    keys: ['⇦']
  },
  {
    description: 'Flip',
    keys: ['Space']
  }
];

const FlashcardsShow = () => {
  // Hooks
  const classes: any = useStyles();
  const dispatch = useDispatch();
  const { flashcardId } = useParams();
  const me = useSelector((state) => (state as any).user.data);
  const expertMode = useSelector((state) => (state as any).user.expertMode);
  const classList = useSelector((state) => (state as any).user.userClasses.classList);
  const router = useSelector((state) => (state as any).router);
  const location = useLocation();
  const lastLocation = useLastLocation();
  // States
  const [data, setData] = useState<any>({});
  const [isLoadingFlashcards, setIsLoadingFlashcards] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isInQuiz, setIsInQuiz] = useState(false);
  const [isInMatchGame, setIsInMatchGame] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [boardDeckIndex, setBoardDeckIndex] = useState(0);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShortSummary, setIsShortSummary] = useState(true);
  const isBookmarking = useSelector(isApiCalling(userActions.BOOKMARK_FLASHCARDS));
  // Memos
  const cardList = useMemo(
    () =>
      (data.deck || []).map((item) => ({
        id: item.id,
        question: item.question,
        questionImage: item.question_image_url,
        answer: item.answer,
        answerImage: item.answer_image_url
      })),
    [data.deck]
  );
  const deckData = useMemo(
    () => ({
      title: data.title,
      summary: data.summary,
      classId: data.classId,
      sectionId: data.sectionId,
      deck: cardList
    }),
    [data, cardList]
  );
  const pastClassIds = useMemo(() => getPastClassIds(classList), [classList]);
  const shouldRenderFeed = useMemo(() => {
    if (!lastLocation) {
      const query = new URLSearchParams(location.search);

      if (query.get('source') === 'deck') {
        return false;
      }

      return true;
    }

    return lastLocation.pathname.includes('/feed');
  }, [lastLocation, location]);
  // Callbacks
  const reloadData = useCallback(
    (showLoading = false) => {
      if (showLoading) {
        setIsLoadingFlashcards(true);
      }

      getFlashcards({
        flashcardId,
        userId: me.userId
      }).then((rsp) => {
        setData(rsp);

        if (showLoading) {
          setIsLoadingFlashcards(false);
        }
      });
    },
    [flashcardId, setData, setIsLoadingFlashcards, me.userId]
  );
  // Effects
  useEffect(() => reloadData(true), [reloadData]);
  // Data Points
  const elapsed = useRef(0);
  const totalIdleTime = useRef(0);
  const remaining = useRef(timeout);
  const lastActive = useRef<any>(+new Date());
  const timer = useRef(null);

  const handleOnActive = () => {
    const diff = differenceInMilliseconds(new Date(), lastActive.current);
    totalIdleTime.current = Math.max(totalIdleTime.current + diff - timeout, 0);
  };

  const { getRemainingTime, getLastActiveTime, getElapsedTime, reset } = useIdleTimer({
    timeout,
    onActive: handleOnActive
  });
  const initializeTimer = useCallback(() => {
    elapsed.current = 0;
    totalIdleTime.current = 0;
    remaining.current = timeout;
    lastActive.current = new Date();
  }, [elapsed, totalIdleTime, remaining, lastActive]);
  useEffect(() => {
    remaining.current = getRemainingTime();
    lastActive.current = getLastActiveTime();
    elapsed.current = getElapsedTime();
    timer.current = setInterval(() => {
      remaining.current = getRemainingTime();
      lastActive.current = getLastActiveTime();
      elapsed.current = getElapsedTime();
    }, INTERVAL.SECOND);
  });
  // Event Handlers
  const handleActionEdit = useCallback(() => {
    setIsEditing(true);
  }, []);
  const handleActionBookmark = useCallback(() => {
    dispatch(
      bookmarkFlashcards(me.userId, data.feedId, data.bookmarked, () =>
        setData(
          update(data, {
            bookmarked: {
              $set: !data.bookmarked
            }
          })
        )
      )
    );
  }, [dispatch, data, me.userId]);
  const handleActionShare = useCallback(() => {
    setIsShareModalOpen(true);
  }, []);
  // const handleActionMore = useCallback(() => {
  //
  // }, []);
  const handleSummaryMoreOrLess = useCallback(() => {
    setIsShortSummary(!isShortSummary);
  }, [isShortSummary]);
  const handleBack = useCallback(() => {
    dispatch(goBack());
  }, [dispatch]);
  const handlePrevDeck = useCallback(() => {
    if (boardDeckIndex === 0) {
      return;
    }

    setBoardDeckIndex(boardDeckIndex - 1);
  }, [boardDeckIndex]);
  const handleNextDeck = useCallback(() => {
    if (boardDeckIndex >= data.deck.length - 1) {
      return;
    }

    setBoardDeckIndex(boardDeckIndex + 1);
  }, [boardDeckIndex, data]);
  const handleCloseShareLinkModal = useCallback(() => {
    setIsShareModalOpen(false);
  }, []);
  const handleCloseEditModal = useCallback(() => {
    setIsEditing(false);
  }, []);
  const handleEditFinish = useCallback(() => {
    handleCloseEditModal();
    reloadData(true);
  }, [reloadData, handleCloseEditModal]);
  const handleReview = useCallback(() => {
    reset();
    initializeTimer();
    setIsReviewing(true);
  }, [reset, initializeTimer]);
  const handleCloseReviewModal = useCallback(() => {
    logEvent({
      event: 'Flashcard Review- Viewed',
      props: {
        flashcard_id: data.postId,
        elapsed: elapsed.current,
        total_idle_time: totalIdleTime.current,
        effective_time: elapsed.current - totalIdleTime.current,
        platform: 'Web'
      }
    });
    setIsReviewing(false);
  }, [data.postId]);
  const handleStartQuiz = useCallback(() => setIsInQuiz(true), []);
  const handleCloseQuiz = useCallback(() => setIsInQuiz(false), []);
  const handleStartMatchGame = useCallback(() => setIsInMatchGame(true), []);
  const handleCloseMatchGame = useCallback(() => setIsInMatchGame(false), []);
  const handleClickUser = useCallback(() => {
    dispatch(
      push(
        buildPath(`/profile/${data.userId}`, {
          from: PROFILE_PAGE_SOURCE.FLASHCARD
        })
      )
    );
  }, [dispatch, data]);
  const handleReport = useCallback(() => {
    setIsReportModalOpen(true);
  }, []);

  const handleReportClose = () => {
    setIsReportModalOpen(false);
  };

  const handleDelete = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);
  const handleDeleteClose = useCallback(
    ({ deleted }: { deleted: boolean | null | undefined }) => {
      setIsDeleteModalOpen(false);

      if (deleted && deleted === true) {
        dispatch(push('/feed'));
      }
    },
    [dispatch]
  );
  const handlePush = useCallback(
    (url) => {
      dispatch(push(url));
    },
    [dispatch]
  );
  const handleGoBack = useCallback(() => {
    dispatch(goBack());
  }, [dispatch]);
  const DeckList = useMemo(
    () => <FlashcardsListEditor data={cardList} toolbarPrefix="show" readOnly />,
    [cardList]
  );
  // Prevent page down from `Space`
  useEffect(() => {
    const eventListener = (event) => {
      if (event.keyCode === 32 && event.target === document.body) {
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', eventListener);
    return () => window.removeEventListener('keydown', eventListener);
  }, []);
  // Deal with keyboard shortcut keys
  useHotkeys('Left', handlePrevDeck, {}, [handlePrevDeck]);
  useHotkeys('Right', handleNextDeck, {}, [handleNextDeck]);

  // Rendering
  if (_.isEmpty(data) || isLoadingFlashcards) {
    return <LoadingSpin />;
  }

  const renderBody = () => (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8} xl={9}>
          <CardBoard data={data.deck[boardDeckIndex]} />
          <Box
            mt={2}
            display="flex"
            justifyContent="center"
            alignItems="center"
            position="relative"
          >
            <Box mr={2}>
              <TransparentIconButton disabled={boardDeckIndex === 0} onClick={handlePrevDeck}>
                <IconPrevious />
              </TransparentIconButton>
            </Box>
            <LinearProgressBar value={boardDeckIndex + 1} totalValue={data.deck.length} />
            <Box ml={2}>
              <TransparentIconButton
                disabled={boardDeckIndex === data.deck.length - 1}
                onClick={handleNextDeck}
              >
                <IconNext />
              </TransparentIconButton>
            </Box>
            <Box className={classes.hotkey}>
              <HotKeyGuide data={HOT_KEYS} />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} lg={4} xl={3}>
          <Box fontSize={18} fontWeight={800}>
            Practice Mode
          </Box>
          <Box mt={3}>
            <ActionButton startIcon={<IconSchool />} onClick={handleReview}>
              Review Time
            </ActionButton>
          </Box>
          <Box mt={3}>
            <ActionButton startIcon={<IconBook />} onClick={handleStartQuiz}>
              Quiz Yourself
            </ActionButton>
          </Box>
          <Box fontSize={18} fontWeight={800} mt={5}>
            Game Mode
          </Box>
          <Box mt={3}>
            <ActionButton startIcon={<IconNote />} onClick={handleStartMatchGame}>
              Match Magic
            </ActionButton>
          </Box>
        </Grid>
      </Grid>
      <Box mt={3} mb={3}>
        <Typography variant="h6">
          {`List of Flashcards in ${me.userId === data.userId ? 'Your' : `${data.name}'s`} Deck (${
            data.deck.length
          })`}
        </Typography>
      </Box>
      {DeckList}
    </>
  );

  const renderAsFeed = () => (
    <PostItem feedId={data.feedId} isFlashcard>
      <PostItemHeader
        hideShare
        feedId={data.feedId}
        classId={data.classId}
        expertMode={expertMode}
        pushTo={handlePush}
        router={router}
        pop={handleGoBack}
        postId={data.postId}
        typeId={data.typeId}
        currentUserId={me.userId}
        userId={data.userId}
        name={data.name}
        userProfileUrl={data.userProfileUrl}
        classroomName={data.courseDisplayName}
        created={data.created}
        body={data.summary}
        title={data.title}
        bookmarked={data.bookmarked}
        roleId={data.roleId}
        role={data.role}
        onBookmark={handleActionBookmark}
        onReport={handleReport}
        onDelete={handleDelete}
        onEdit={handleActionEdit}
      />
      <Box mt={3} />
      {renderBody()}
      <Box>
        <PostTags userId={me.userId} feedId={data.feedId} />
      </Box>
      <Box mt={3}>
        <PostItemActions
          userId={me.userId}
          ownerId={data.userId}
          feedId={data.feedId}
          postId={data.postId}
          typeId={data.typeId}
          name={data.name}
          userProfileUrl={data.profileImage}
          thanked={data.thanked}
          inStudyCircle={data.inStudyCircle}
          questionsCount={data.postInfo.questionsCount}
          thanksCount={data.postInfo.thanksCount}
          viewCount={data.postInfo.viewCount}
          ownName={`${me.firstName} ${me.lastName}`}
          onReload={reloadData}
        />
      </Box>
      <Box>
        <PostComments
          isPastClassFlashcard={pastClassIds.includes(data.classId)}
          feedId={data.feedId}
          postId={data.postId}
          typeId={data.typeId}
          classId={data.classId}
          readOnly={data.readOnly}
        />
      </Box>
    </PostItem>
  );

  const renderAsNonFeed = () => (
    <>
      <Box pt={2} mb={2}>
        <Link component="button" color="inherit" underline="none" onClick={handleBack}>
          <Typography variant="h6">
            <IconBack className={classes.iconMiddle} />
            Back
          </Typography>
        </Link>
      </Box>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} lg={8} xl={9}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Link component="button" onClick={handleClickUser}>
                <Avatar
                  fullName={data.name}
                  profileImage={data.userProfileUrl}
                  desktopSize={45}
                  mobileSize={45}
                />
              </Link>
            </Grid>
            <Grid item>
              <Link underline="none" component="button" onClick={handleClickUser} variant="h6">
                {data.name}
              </Link>
              <Typography variant="body2">
                {data.courseDisplayName} &nbsp; • &nbsp; {moment(data.created).fromNow()}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={4} xl={3}>
          <Grid container spacing={2}>
            {me.userId === data.userId && !pastClassIds.includes(data.classId) && (
              <Grid item>
                <IconActionButton onClick={handleActionEdit}>
                  <IconPen />
                </IconActionButton>
              </Grid>
            )}
            <Grid item>
              <IconActionButton
                onClick={handleActionBookmark}
                disabled={isBookmarking}
                loading={isBookmarking}
              >
                {data.bookmarked ? <IconBookmark /> : <IconBookmarkBorder />}
              </IconActionButton>
            </Grid>
            <Grid item>
              <IconActionButton onClick={handleActionShare}>
                <IconShare />
              </IconActionButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            {data.title}
          </Typography>
          <Typography>
            {isShortSummary
              ? _.truncate(data.summary, {
                  length: 50
                })
              : data.summary}
            {data.summary.length > DESCRIPTION_LENGTH_THRESHOLD && (
              <Link
                className={classes.moreLessLink}
                onClick={handleSummaryMoreOrLess}
                color="inherit"
                underline="always"
              >
                {isShortSummary ? 'see more' : 'show less'}
              </Link>
            )}
          </Typography>
        </Grid>
      </Grid>
      {renderBody()}
    </>
  );

  return (
    <Box>
      {shouldRenderFeed ? renderAsFeed() : renderAsNonFeed()}

      {/* Modals for the page */}

      <Report
        open={isReportModalOpen}
        ownerId={data.userId}
        objectId={data.feedId}
        onClose={handleReportClose}
      />

      <DeletePost open={isDeleteModalOpen} feedId={data.feedId} onClose={handleDeleteClose} />

      <ShareLinkModal
        open={isShareModalOpen}
        link={`${APP_ROOT_PATH}/flashcards/${data.postId}`}
        title={
          <Typography variant="h6">
            <span role="img" aria-label="Two hands">
              🙌
            </span>
            &nbsp; You’re awesome for helping your peers! Ready to share a link to your{' '}
            <b>{data.title}</b> deck?
          </Typography>
        }
        onClose={handleCloseShareLinkModal}
      />

      <Dialog
        fullScreen
        open={isEditing}
        onCancel={handleCloseEditModal}
        TransitionComponent={SlideUp}
        id="flashcards-edit-modal"
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
          flashcardTitle={data.title}
          cards={cardList}
          onClose={handleCloseReviewModal}
        />
      </Dialog>

      <Dialog
        fullScreen
        className={classes.reviewModal}
        contentClassName={classes.reviewModalContent}
        open={isInQuiz}
        onCancel={handleCloseQuiz}
        showHeader={false}
        TransitionComponent={SlideUp}
      >
        <FlashcardsQuiz flashcardId={data.postId} cards={cardList} onClose={handleCloseQuiz} />
      </Dialog>

      <Dialog
        fullScreen
        className={classes.reviewModal}
        contentClassName={clsx(classes.reviewModalContent, classes.matchModalContent)}
        open={isInMatchGame}
        onCancel={handleCloseMatchGame}
        showHeader={false}
        TransitionComponent={SlideUp}
      >
        <FlashcardsMatchGame
          cards={cardList}
          flashcardId={flashcardId}
          flashcardTitle={data.title}
          onClose={handleCloseMatchGame}
        />
      </Dialog>
      <ScrollToTop />
    </Box>
  );
};

export default FlashcardsShow;
