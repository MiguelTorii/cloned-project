import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import withRoot from '../../withRoot';
import useStyles from './styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconSchool from '@material-ui/icons/School';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import IconLeft from '@material-ui/icons/ArrowBack';
import IconRight from '@material-ui/icons/ArrowForward';
import Slide from '@material-ui/core/Slide';
import clsx from 'clsx';
import MarkCard from './MarkCard';
import Button from '@material-ui/core/Button';
import IconPrev from '@material-ui/icons/SkipPrevious';
import IconClose from '@material-ui/icons/Close';
import IconShuffle from '@material-ui/icons/Shuffle';
import TransparentIconButton from '../Basic/Buttons/TransparentIconButton';
import IconPrevious from "@material-ui/icons/ArrowBack";
import LinearProgressBar from '../LinearProgressBar';
import IconNext from "@material-ui/icons/ArrowForward";
import CardBoard from './CardBoard';
import store from 'store';
import { shuffleArray } from '../../utils/helpers';
import Dialog from '../Dialog';
import _ from 'lodash';
import { logEventLocally } from '../../api/analytics';
import uuidv4 from "uuid/v4";
import { TIMEOUT } from 'constants/common';
import { useIdleTimer } from 'react-idle-timer';
import { logEvent } from 'api/analytics';
import { differenceInMilliseconds } from "date-fns";
import { INTERVAL } from 'constants/app';

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
    title: 'Didn\'t Remember',
    color: '#C45960',
    emoji: '😳'
  }
]
const timeout = TIMEOUT.FLASHCARD_REVEIW

const FlashcardsReview = ({ flashcardId, cards, onClose }) => {
  const classes = useStyles();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [cardsLevel, setCardsLevel] = useState({});
  const [currentLevel, setCurrentLevel] = useState('to_review');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentCardList, setCurrentCardList] = useState([]);
  const [sessionId, setSessionId] = useState(null);

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

  const {
    getRemainingTime,
    getLastActiveTime,
    getElapsedTime,
    reset,
  } = useIdleTimer({
    timeout,
    onActive: handleOnActive,
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
    }
  });

  // Effects
  useEffect(() => {
    setCardsLevel(store.get(`flashcards-${flashcardId}`) || {});
    setCurrentLevel('to_review');
    setSessionId(uuidv4());
  }, [flashcardId]);

  useEffect(() => {
    setCurrentCardIndex(0);
  }, [currentLevel]);

  useEffect(() => {
    setCurrentCardList(cards.filter((card) => {
      if (currentLevel === 'to_review') return !cardsLevel[card.id];
      return cardsLevel[card.id] === currentLevel;
    }));
  }, [cards, currentLevel, cardsLevel]);

  useEffect(() => {
    if (!_.isEmpty(cardsLevel)) {
      store.set(`flashcards-${flashcardId}`, cardsLevel);
    }
  }, [cardsLevel, flashcardId]);

  useEffect(() => {
    currentCardList.length > 0 && elapsed.current && logEvent({
      event: 'Flashcard Review- Viewed',
      props: {
        flashcardId,
        cardId: currentCardList[currentCardIndex].id,
        elapsed: elapsed.current,
        total_idle_time: totalIdleTime.current,
        effective_time: elapsed.current - totalIdleTime.current,
        platform: 'Web',
      }
    });
    reset()
    // eslint-disable-next-line
  }, [flashcardId, currentCardList, currentCardIndex])

  const initializeTimer = useCallback(() => {
    elapsed.current = 0
    totalIdleTime.current = 0
    remaining.current = timeout
    lastActive.current = new Date()
  }, [elapsed, totalIdleTime, remaining, lastActive])

  // Memos
  const cardCountsByLevel = useMemo(() => {
    const count = { to_review: 0 };

    ANSWER_LEVELS.forEach((item) => count[item.level] = 0);

    (cards || []).forEach((item) => {
      count[cardsLevel[item.id] || 'to_review'] += 1;
    });

    return count;
  }, [cards, cardsLevel]);

  // Event Handlers
  const handleExpand = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const handleMarkCardClick = useCallback((level) => {
    if (currentLevel === level) {
      setCurrentLevel('to_review');
    } else {
      setCurrentLevel(level);
    }
  }, [currentLevel]);

  const handlePrevCard = useCallback(() => {
    setCurrentCardIndex(currentCardIndex - 1);
  }, [currentCardIndex]);

  const handleNextCard = useCallback(() => {
    setCurrentCardIndex(currentCardIndex + 1);
  }, [currentCardIndex]);

  const handleSetCurrentCardLevel = useCallback((level) => {
    if (level === currentLevel) return ;

    const card = currentCardList[currentCardIndex];
    const levelData = ANSWER_LEVELS.find((item) => item.level === level);

    logEventLocally({
      category: 'Flashcard',
      flashcard_study_session_id: sessionId,
      flashcard_user_selected_difficulty: levelData.score,
      objectId: card.id,
      type: 'Rated',
    });

    logEvent({
      event: 'Flashcard Review- Viewed',
      props: {
        flashcardId,
        cardId: card.id,
        elapsed: elapsed.current,
        total_idle_time: totalIdleTime.current,
        effective_time: elapsed.current - totalIdleTime.current,
        platform: 'Web',
      }
    });
    reset()
    initializeTimer()

    if (currentCardIndex >= currentCardList.length - 1) {
      setCurrentCardIndex(0);
    }

    setCardsLevel({
      ...cardsLevel,
      [card.id]: level
    });
  }, [
    currentCardIndex,
    currentCardList,
    cardsLevel,
    currentLevel,
    sessionId,
    flashcardId,
    reset,
    initializeTimer
  ]);

  const handleShuffleDeck = useCallback(() => {
    shuffleArray(currentCardList);
    setCurrentCardList([...currentCardList]);
    setCurrentCardIndex(0);
  }, [currentCardList]);

  const handleStartOver = useCallback(() => {
    setIsConfirmModalOpen(true);
  }, []);

  const handleResetProgress = useCallback(() => {
    reset();
    initializeTimer()
    setIsConfirmModalOpen(false);
    setCardsLevel({});
    store.remove(`flashcards-${flashcardId}`);
  }, [flashcardId, reset, initializeTimer]);

  const handleCloseConfirmModal = useCallback(() => {
    setIsConfirmModalOpen(false);
  }, []);

  const handleClose = useCallback(() => {
    try {
      clearInterval(timer.current);
      logEvent({
        event: 'Flashcard- Time Spent',
        props: {
          flashcardId,
          elapsed: elapsed.current,
          total_idle_time: totalIdleTime.current,
          effective_time: elapsed.current - totalIdleTime.current,
          platform: 'Web',
        }
      });
      reset()
    } catch (err) {}

    onClose();
  }, [onClose, elapsed, totalIdleTime, flashcardId, reset])

  const renderSidebar = () => (
    <Box className={clsx(classes.sidebar, !isExpanded && classes.hidden)}>
      <Box display="flex" alignItems="center">
        <Box mr={2}>
          <IconSchool />
        </Box>
        <Typography variant="h5">
          Review Time
        </Typography>
      </Box>
      <Box mt={4}/>
      <Grid container spacing={2}>
        { ANSWER_LEVELS.map((item) => (
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
        <IconLeft />
      </IconButton>
    </Box>
  );

  const renderContent = () => (
    <>
      <Box display="flex" justifyContent="flex-end">
        <Button
          startIcon={<IconPrev />}
          className={classes.actionButton} mr={3}
          onClick={handleStartOver}
        >
          Start Over
        </Button>
        <Button
          startIcon={<IconClose />}
          className={classes.actionButton}
          onClick={handleClose}
        >
          Exit Game
        </Button>
      </Box>
      { currentCardList.length === 0 ? (
        <Box mt={8}>
          <Typography variant="h6" align="center">
            You don't have any cards in this stack!
          </Typography>
          <Typography variant="h6" align="center">
            Click a different stack on the left side to view more cards
          </Typography>
        </Box>
      ) : (
        <>
          <Box mt={2} mb={2}>
            <CardBoard
              data={currentCardList[currentCardIndex]}
              onAction={handleSetCurrentCardLevel}
            />
          </Box>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Button
                startIcon={<IconShuffle />}
                className={classes.shuffleButton}
                onClick={handleShuffleDeck}
              >
                Shuffle Deck
              </Button>
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
      )}

    </>
  );

  return (
    <Box display="flex" position="relative">
      <Slide in={isExpanded} direction="right">
        { renderSidebar() }
      </Slide>
      <Box className={classes.mainContent}>
        { renderContent() }
      </Box>
      { !isExpanded && (
        <IconButton
          className={clsx(classes.expandButton, classes.bodyButton)}
          onClick={handleExpand}
        >
          <IconRight />
        </IconButton>
      )}

      <Dialog
        okTitle="Yes"
        onCancel={handleCloseConfirmModal}
        onOk={handleResetProgress}
        open={isConfirmModalOpen}
        showActions
        showCancel
        title="Start Over"
      >
        If you Start Over, then you'll reset your progress. Are you sure you want to restart?
      </Dialog>
    </Box>
  );
};

FlashcardsReview.propTypes = {
  flashcardId: PropTypes.number.isRequired,
  cards: PropTypes.array.isRequired,
  onClose: PropTypes.func
};

FlashcardsReview.defaultProps = {
  onClose: () => {}
};

export default withRoot(FlashcardsReview);
