import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

export const ANSWER_LEVELS = [
  {
    level: 'easy',
    title: 'Knew It Well',
    color: '#74C182',
    emoji: '😎'
  },
  {
    level: 'medium',
    title: 'Almost Had It',
    color: '#EBAE64',
    emoji: '😅'
  },
  {
    level: 'hard',
    title: 'Didn\'t Remember',
    color: '#C45960',
    emoji: '😳'
  }
]

const FlashcardsReview = ({ flashcardId, cards, onClose }) => {
  const classes = useStyles();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [cardsLevel, setCardsLevel] = useState({});
  const [currentLevel, setCurrentLevel] = useState('to_review');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentCardList, setCurrentCardList] = useState([]);

  // Effects
  useEffect(() => {
    setCardsLevel(store.get(`flashcards-${flashcardId}`) || {});
    setCurrentLevel('to_review');
  }, [flashcardId, setCardsLevel]);

  useEffect(() => {
    setCurrentCardIndex(0);
  }, [currentLevel, setCurrentCardIndex]);

  useEffect(() => {
    setCurrentCardList(cards.filter((card) => {
      if (currentLevel === 'to_review') return !cardsLevel[card.id];
      return cardsLevel[card.id] === currentLevel;
    }));
  }, [cards, currentLevel, cardsLevel, setCurrentCardList]);

  useEffect(() => {
    if (!_.isEmpty(cardsLevel)) {
      store.set(`flashcards-${flashcardId}`, cardsLevel);
    }
  }, [cardsLevel, flashcardId]);

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
  }, [isExpanded, setIsExpanded]);

  const handleMarkCardClick = useCallback((level) => {
    if (currentLevel === level) {
      setCurrentLevel('to_review');
    } else {
      setCurrentLevel(level);
    }
  }, [setCurrentLevel, currentLevel]);

  const handlePrevCard = useCallback(() => {
    setCurrentCardIndex(currentCardIndex - 1);
  }, [currentCardIndex, setCurrentCardIndex]);

  const handleNextCard = useCallback(() => {
    setCurrentCardIndex(currentCardIndex + 1);
  }, [currentCardIndex, setCurrentCardIndex]);

  const handleSetCurrentCardLevel = useCallback((level) => {
    if (level === currentLevel) return ;

    const card = currentCardList[currentCardIndex];

    if (currentCardIndex >= currentCardList.length - 1) {
      setCurrentCardIndex(0);
    }

    setCardsLevel({
      ...cardsLevel,
      [card.id]: level
    });
  }, [currentCardIndex, currentCardList, cardsLevel, setCardsLevel, currentLevel]);

  const handleShuffleDeck = useCallback(() => {
    shuffleArray(currentCardList);
    setCurrentCardList([...currentCardList]);
    setCurrentCardIndex(0);
  }, [setCurrentCardList, currentCardList]);

  const handleStartOver = useCallback(() => {
    setIsConfirmModalOpen(true);
  }, [setIsConfirmModalOpen]);

  const handleResetProgress = useCallback(() => {
    setIsConfirmModalOpen(false);
    setCardsLevel({});
    store.remove(`flashcards-${flashcardId}`);
  }, [setIsConfirmModalOpen, setCardsLevel, flashcardId]);

  const handleCloseConfirmModal = useCallback(() => {
    setIsConfirmModalOpen(false);
  }, [setIsConfirmModalOpen]);

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
          onClick={onClose}
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
