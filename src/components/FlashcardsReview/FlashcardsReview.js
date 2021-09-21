import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef
} from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconSchool from '@material-ui/icons/School';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import IconPrev from '@material-ui/icons/SkipPrevious';
import IconClose from '@material-ui/icons/Close';
import IconShuffle from '@material-ui/icons/Shuffle';
import { IconLeft, IconPrevious } from '@material-ui/icons/ArrowBack';
import { IconRight, IconNext } from '@material-ui/icons/ArrowForward';
import store from 'store';
import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import { TIMEOUT } from 'constants/common';
import { useIdleTimer } from 'react-idle-timer';
import { logEvent } from 'api/analytics';
import { differenceInMilliseconds } from 'date-fns';
import { APP_ROOT_PATH, INTERVAL } from 'constants/app';
import Link from '@material-ui/core/Link';
import IconBack from '@material-ui/icons/ChevronLeft';
import { useSelector } from 'react-redux';
import GifCongrats from 'assets/gif/match-game-congrats.gif';
import ShareLinkModal from 'components/ShareLinkModal/ShareLinkModal';
import IconShare from '@material-ui/icons/ShareOutlined';
import TransparentButton from 'components/Basic/Buttons/TransparentButton';
import ImgNoCards from 'assets/svg/no-cards.svg';
import IconReturn from '@material-ui/icons/Reply';
import { logEventLocally } from '../../api/analytics';
import Dialog from '../Dialog/Dialog';
import { shuffleArray } from '../../utils/helpers';
import CardBoard from './CardBoard';
import LinearProgressBar from '../LinearProgressBar/LinearProgressBar';
import TransparentIconButton from '../Basic/Buttons/TransparentIconButton';
import MarkCard from './MarkCard';
import useStyles from './styles';
import withRoot from '../../withRoot';

export const ANSWER_LEVELS = [
  {
    level: 'easy',
    score: 1,
    title: 'Knew It Well',
    color: '#74C182',
    emoji: '😎'
  },
  {
    level: 'medium',
    score: 5,
    title: 'Almost Had It',
    color: '#EBAE64',
    emoji: '😅'
  },
  {
    level: 'hard',
    score: 10,
    title: "Didn't Remember",
    color: '#C45960',
    emoji: '😳'
  }
];
const CARDS_TO_REVIEW = 'to_review';
const timeout = TIMEOUT.FLASHCARD_REVEIW;

const FlashcardsReview = ({ flashcardId, flashcardTitle, cards, onClose }) => {
  const classes = useStyles();
  const me = useSelector((state) => state.user.data);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [cardsLevel, setCardsLevel] = useState({});
  const [currentLevel, setCurrentLevel] = useState(CARDS_TO_REVIEW);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentCardList, setCurrentCardList] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [shuffledCards, setShuffledCards] = useState([]);
  const [keptCardIndex, setKeptCardIndex] = useState(0);

  // Data Points
  const elapsed = useRef(0);
  const totalIdleTime = useRef(0);
  const remaining = useRef(timeout);
  const lastActive = useRef(+new Date());
  const timer = useRef(null);

  const handleOnActive = () => {
    const diff = differenceInMilliseconds(new Date(), lastActive.current);
    totalIdleTime.current = Math.max(totalIdleTime.current + diff - timeout, 0);
  };

  const { getRemainingTime, getLastActiveTime, getElapsedTime, reset } =
    useIdleTimer({
      timeout,
      onActive: handleOnActive
    });

  useEffect(() => {
    remaining.current = getRemainingTime();
    lastActive.current = getLastActiveTime();
    elapsed.current = getElapsedTime();

    timer.current = setInterval(() => {
      remaining.current = getRemainingTime();
      lastActive.current = getLastActiveTime();
      elapsed.current = getElapsedTime();
    }, INTERVAL.SECOND);

    return () => {
      clearInterval(timer.current);
    };
  });

  // Effects
  useEffect(() => {
    setCardsLevel(store.get(`flashcards-${flashcardId}`) || {});
    setCurrentLevel(CARDS_TO_REVIEW);
    setSessionId(uuidv4());
  }, [flashcardId]);

  useEffect(() => {
    if (currentLevel === CARDS_TO_REVIEW) {
      if (isShuffleOn) {
        setCurrentCardList(shuffledCards);
      } else {
        setCurrentCardList(cards);
      }
    } else {
      setCurrentCardList(
        cards.filter((card) => cardsLevel[card.id] === currentLevel)
      );
    }
  }, [cards, currentLevel, cardsLevel, isShuffleOn, shuffledCards]);

  useEffect(() => {
    if (currentLevel === CARDS_TO_REVIEW) {
      setCurrentCardIndex(keptCardIndex);
    } else {
      setCurrentCardIndex(0);
    }
  }, [currentLevel, keptCardIndex]);

  useEffect(() => {
    if (!_.isEmpty(cardsLevel)) {
      store.set(`flashcards-${flashcardId}`, cardsLevel);
    }
  }, [cardsLevel, flashcardId]);

  const sendLogEvent = useCallback(() => {
    logEvent({
      event: 'Flashcard- Viewed',
      props: {
        flashcard_id: flashcardId,
        card_id: currentCardList[currentCardIndex].id,
        elapsed: elapsed.current,
        total_idle_time: totalIdleTime.current,
        effective_time: elapsed.current - totalIdleTime.current,
        platform: 'Web'
      }
    });
    reset();
  }, [flashcardId, currentCardIndex, currentCardList, reset]);

  const initializeTimer = useCallback(() => {
    elapsed.current = 0;
    totalIdleTime.current = 0;
    remaining.current = timeout;
    lastActive.current = new Date();
  }, [elapsed, totalIdleTime, remaining, lastActive]);

  // Memos
  const cardCountsByLevel = useMemo(() => {
    const count = { to_review: 0 };

    ANSWER_LEVELS.forEach((item) => (count[item.level] = 0));
    (cards || []).forEach((item) => {
      count[cardsLevel[item.id] || CARDS_TO_REVIEW] += 1;
    });

    return count;
  }, [cards, cardsLevel]);

  // Event Handlers
  const handleExpand = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const handleMarkCardClick = useCallback(
    (level) => {
      reset();
      initializeTimer();

      if (currentLevel === level) {
        setCurrentLevel(CARDS_TO_REVIEW);
      } else {
        setCurrentLevel(level);
      }

      if (currentLevel === CARDS_TO_REVIEW) {
        setKeptCardIndex(currentCardIndex);
      }
    },
    [currentLevel, currentCardIndex, reset, initializeTimer]
  );

  const handlePrevCard = useCallback(() => {
    sendLogEvent();
    setCurrentCardIndex(currentCardIndex - 1);
  }, [sendLogEvent, currentCardIndex]);

  const handleNextCard = useCallback(() => {
    sendLogEvent();
    setCurrentCardIndex(currentCardIndex + 1);
  }, [sendLogEvent, currentCardIndex]);

  const handleSetCurrentCardLevel = useCallback(
    (level) => {
      if (level === currentLevel) return;

      const card = currentCardList[currentCardIndex];
      const levelData = ANSWER_LEVELS.find((item) => item.level === level);

      logEventLocally({
        category: 'Flashcard',
        flashcard_study_session_id: sessionId,
        flashcard_user_selected_difficulty: levelData.score,
        objectId: card.id,
        type: 'Rated'
      });

      logEvent({
        event: 'Flashcard- Viewed',
        props: {
          flashcard_id: flashcardId,
          card_id: card.id,
          elapsed: elapsed.current,
          total_idle_time: totalIdleTime.current,
          effective_time: elapsed.current - totalIdleTime.current,
          platform: 'Web'
        }
      });
      reset();
      initializeTimer();

      if (currentLevel === CARDS_TO_REVIEW) {
        setCurrentCardIndex(currentCardIndex + 1);
      }

      setCardsLevel({
        ...cardsLevel,
        [card.id]: level
      });
    },
    [
      currentCardIndex,
      currentCardList,
      cardsLevel,
      currentLevel,
      sessionId,
      flashcardId,
      reset,
      initializeTimer
    ]
  );

  const handleShuffleDeck = useCallback(() => {
    setCurrentCardIndex(0);
    if (!isShuffleOn) {
      setShuffledCards(shuffleArray(cards));
    }
    setIsShuffleOn(!isShuffleOn);
  }, [cards, isShuffleOn]);

  const handleStartOver = useCallback(() => {
    setIsConfirmModalOpen(true);
  }, []);

  const handleResetProgress = useCallback(() => {
    reset();
    initializeTimer();
    setIsConfirmModalOpen(false);
    setCardsLevel({});
    setIsShuffleOn(false);
    setCurrentCardIndex(0);
    setKeptCardIndex(0);
    setCurrentLevel(CARDS_TO_REVIEW);
    store.remove(`flashcards-${flashcardId}`);
  }, [flashcardId, reset, initializeTimer]);

  const handleCloseConfirmModal = useCallback(() => {
    setIsConfirmModalOpen(false);
  }, []);

  const handleOpenShareModal = useCallback(() => {
    setIsShareModalOpen(true);
  }, []);

  const handleCloseShareModal = useCallback(
    () => setIsShareModalOpen(false),
    []
  );

  const renderSidebar = () => (
    <Box
      className={clsx(
        classes.sidebar,
        !isExpanded && classes.unExpandedSidebar
      )}
    >
      <Box mb={3}>
        <Link
          component="button"
          onClick={onClose}
          color="inherit"
          variant="h5"
          underline="none"
        >
          <IconBack className={classes.iconMiddle} /> Back
        </Link>
      </Box>
      <Box display="flex" alignItems="center">
        <Box mr={2}>
          <IconSchool />
        </Box>
        <Typography variant="h5">Review Time</Typography>
      </Box>
      <Box mt={4} />
      <Grid container spacing={2}>
        {ANSWER_LEVELS.map((item) => (
          <Grid key={item.level} item xs={12}>
            <MarkCard
              title={item.title}
              mark={cardCountsByLevel[item.level]}
              markColor={item.color}
              active={currentLevel === item.level}
              onClick={() => handleMarkCardClick(item.level)}
            />
          </Grid>
        ))}
      </Grid>
      <IconButton
        className={clsx(classes.sidebarButton, classes.expandButton)}
        onClick={handleExpand}
      >
        {isExpanded ? <IconLeft /> : <IconRight />}
      </IconButton>
    </Box>
  );

  const renderHelperText = (percent) => {
    if (percent <= 25) {
      return (
        <>
          That’s okay! Keep practicing and you’ll do even better next time! 📖
          <br />
          Click any stack to review your flashcards or start over.
        </>
      );
    }
    if (percent <= 50) {
      return (
        <>
          Keep practicing, you can do this! 👏
          <br />
          Click any stack to review your flashcards or start over.
        </>
      );
    }
    if (percent <= 75) {
      return (
        <>
          You’re getting there! Keep going! 🙌
          <br />
          Click any stack to review your flashcards or start over.
        </>
      );
    }
    if (percent <= 89) {
      return (
        <>
          Woo! Show your test who’s boss! 🔥
          <br />
          Click any stack to review your flashcards or start over.
        </>
      );
    }
    if (percent <= 99) {
      return (
        <>
          High five! You’re a rockstar! 🎉
          <br />
          Click any stack to review your flashcards or start over.
        </>
      );
    }
    return (
      <>
        PERFECT SCORE! Your hard work is paying off! 🚀
        <br />
        Click any stack to review your flashcards or start over.
      </>
    );
  };

  const renderData = () => {
    if (currentCardIndex >= currentCardList.length) {
      if (currentLevel === CARDS_TO_REVIEW) {
        if (currentCardList.length === 0) {
          return null;
        }

        const correctCount = cardCountsByLevel[ANSWER_LEVELS[0].level];
        const percentage = (
          (correctCount * 100.0) /
          currentCardList.length
        ).toFixed(0);
        return (
          <Box mt={8}>
            <Typography variant="h4" align="center">
              Congrats on Completing Review Time, {me.firstName}! 👏
            </Typography>
            <Box mt={3} display="flex" justifyContent="center">
              <img src={GifCongrats} alt="Congratulations!" />
            </Box>
            <Box mt={3}>
              <Typography
                className={classes.secondaryText}
                variant="h6"
                align="center"
                paragraph
              >
                You got <b className={classes.successText}>{correctCount}</b>{' '}
                out of <b>{currentCardList.length}</b> correct and score a{' '}
                <b>{percentage}</b>%.
              </Typography>
              <Typography className={classes.secondaryText} align="center">
                {renderHelperText(percentage)}
              </Typography>
            </Box>
            <Box mt={2} display="flex" justifyContent="center">
              <TransparentButton
                startIcon={<IconShare />}
                onClick={handleOpenShareModal}
              >
                Share this Flashcard Deck with Classmates
              </TransparentButton>
            </Box>
          </Box>
        );
      }
      return (
        <>
          <Box mt={8} display="flex" justifyContent="center">
            <img src={ImgNoCards} alt="No cards" />
          </Box>
          <Typography
            variant="h6"
            gutterBottom
            align="center"
            className={classes.secondaryText}
          >
            You don't have any cards in this stack yet.
          </Typography>
          <Typography align="center" className={classes.secondaryText}>
            You can return to the main deck to review all your cards.
          </Typography>
          <Box mt={2} display="flex" justifyContent="center">
            <TransparentButton
              startIcon={<IconReturn />}
              onClick={() => setCurrentLevel(CARDS_TO_REVIEW)}
            >
              Return to the Main Deck
            </TransparentButton>
          </Box>
        </>
      );
    }

    return (
      <>
        <Box mt={2} mb={2}>
          <CardBoard
            data={currentCardList[currentCardIndex]}
            onAction={handleSetCurrentCardLevel}
          />
        </Box>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            {currentLevel === CARDS_TO_REVIEW && (
              <Button
                startIcon={<IconShuffle />}
                className={clsx(classes.shuffleButton, isShuffleOn && 'active')}
                onClick={handleShuffleDeck}
              >
                {isShuffleOn ? 'Shuffle Deck On' : 'Shuffle Deck'}
              </Button>
            )}
          </Grid>
          <Grid item>
            <Box display="flex">
              <LinearProgressBar
                value={currentCardIndex + 1}
                totalValue={currentCardList.length}
              />
              <Box ml={3}>
                <TransparentIconButton
                  disabled={currentCardIndex === 0}
                  onClick={handlePrevCard}
                >
                  <IconPrevious />
                </TransparentIconButton>
              </Box>
              <Box ml={3}>
                <TransparentIconButton
                  disabled={currentCardIndex >= currentCardList.length - 1}
                  onClick={handleNextCard}
                >
                  <IconNext />
                </TransparentIconButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </>
    );
  };

  const renderContent = () => (
    <>
      <Box display="flex" justifyContent="flex-end">
        <Button
          startIcon={<IconPrev />}
          className={classes.actionButton}
          mr={3}
          onClick={handleStartOver}
        >
          Start Over
        </Button>
        <Button
          startIcon={<IconClose />}
          className={classes.actionButton}
          onClick={onClose}
        >
          Exit Mode
        </Button>
      </Box>
      {renderData()}
    </>
  );

  return (
    <Box display="flex" position="relative">
      <Slide in={isExpanded} direction="right">
        {renderSidebar()}
      </Slide>
      <Box className={clsx(classes.mainContent, isExpanded && 'expanded')}>
        {renderContent()}
      </Box>
      <Dialog
        okTitle="Yes"
        onCancel={handleCloseConfirmModal}
        onOk={handleResetProgress}
        open={isConfirmModalOpen}
        showActions
        showCancel
        title="Start Over"
      >
        If you Start Over, then you'll reset your progress. Are you sure you
        want to restart?
      </Dialog>
      <ShareLinkModal
        open={isShareModalOpen}
        link={`${APP_ROOT_PATH}/flashcards/${flashcardId}`}
        title={
          <Typography variant="h6">
            <span role="img" aria-label="Two hands">
              🙌
            </span>
            &nbsp; You’re awesome for helping your peers! Ready to share a link
            to your <b>{flashcardTitle}</b> deck?
          </Typography>
        }
        onClose={handleCloseShareModal}
      />
    </Box>
  );
};

FlashcardsReview.propTypes = {
  flashcardId: PropTypes.number.isRequired,
  flashcardTitle: PropTypes.string,
  cards: PropTypes.array.isRequired,
  onClose: PropTypes.func
};

FlashcardsReview.defaultProps = {
  flashcardTitle: '',
  onClose: () => {}
};

export default withRoot(FlashcardsReview);
