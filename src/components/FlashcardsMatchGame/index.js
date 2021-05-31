import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import ReactDOM from 'react-dom';
import withRoot from '../../withRoot';
import useStyles from './styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import IconLeft from '@material-ui/icons/ArrowBack';
import IconRight from '@material-ui/icons/ArrowForward';
import Slide from '@material-ui/core/Slide';
import clsx from 'clsx';
import Link from '@material-ui/core/Link';
import IconBack from '@material-ui/icons/ChevronLeft';
import IconNote from '@material-ui/icons/LibraryBooks';
import IconClose from '@material-ui/icons/Close';
import SidebarCard from './SidebarCard';
import DraggableCard from './DraggableCard';
import reducer, {
  dragCardCorrect,
  dragCardIncorrect,
  initializeGame,
  initialState,
  placeCards,
  recordDraggedCards, removeLogs
} from './reducer';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import StartupModal from 'components/FlashcardsMatchGame/StartupModal';
import moment from 'moment';
import GifCongrats from 'assets/gif/match-game-congrats.gif';
import TransparentButton from 'components/Basic/Buttons/TransparentButton';
import IconShare from '@material-ui/icons/ShareOutlined';
import { apiEndMatchGame, apiGetMatchStats, apiInitializeMatchGame, apiSaveMatchGameRecords } from 'api/flashcards';
import ContentCard from 'components/FlashcardsMatchGame/ContentCard';
import { useSelector } from 'react-redux';
import { formatSeconds } from 'utils/helpers';
import { APP_ROOT_PATH } from 'constants/app';
import ShareLinkModal from 'components/ShareLinkModal';
import Button from "@material-ui/core/Button";
import IconPrev from "@material-ui/icons/SkipPrevious";
import Dialog from 'components/Dialog';
import LoadingSpin from 'components/LoadingSpin';
import IconUp from 'assets/svg/arrow-up-red.svg';
import IconDown from 'assets/svg/arrow-green-down.svg';

const ANIMATION_TYPES = {
  CORRECT: 'correct',
  INCORRECT: 'incorrect'
};

const ANIMATION_DURATION = 300;
const TIMER_INTERVAL = 100;

const FlashcardsMatchGame = ({ cards, flashcardId, flashcardTitle, onClose }) => {
  const classes = useStyles();
  const me = useSelector((state) => state.user.data);

  const [isExpanded, setIsExpanded] = useState(true);
  const [containerRef, setContainerRef] = useState(null);
  const [cardAnimationData, setCardAnimationData] = useState({
    cardData: null,
    animationType: null,
  });
  const [lastRecordTime, setLastRecordTime] = useState(null);

  // Modal States
  const [isStartupModalOpen, setIsStartupModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isRestartModalOpen, setIsRestartModalOpen] = useState(false);

  // For Stats
  const [matchStat, setMatchStat] = useState({});
  const [isLoadingStat, setIsLoadingStat] = useState(false);

  // Reducer
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    matchCards,
    matchGameId,
    lastIndex,
    correctCount,
    incorrectCount,
    matchStartTime,
    logs
  } = state;

  // Memos
  const isFinished = useMemo(() => {
    return matchCards.length > 0 && correctCount * 2 === matchCards.length;
  }, [correctCount, matchCards.length]);

  const elapsedSeconds = useMemo(() => {
    if (!matchStartTime || !lastRecordTime) return 0;
    return Math.floor(moment.duration(lastRecordTime.diff(matchStartTime)).as('seconds'));
  }, [matchStartTime, lastRecordTime]);

  // Callbacks
  const initializeMatchGame = useCallback(async () => {
    const { match_game_id } = await apiInitializeMatchGame(flashcardId);
    const getCardSize = (image, text) => {
      ReactDOM.render(
        <ContentCard
          image={image}
          text={text}
          x={0}
          y={0}
        />,
        containerRef
      );
      const element = containerRef.childNodes[containerRef.childNodes.length - 1];
      const rect = element.getBoundingClientRect();
      return [Math.floor(rect.width), Math.floor(rect.height)];
    };

    if (containerRef) {
      containerRef.className = containerRef.className.replace('hidden', '');
      const cardsData = cards.map((card) => {
        const questionSize = getCardSize(card.questionImage, card.question);
        const answerSize = getCardSize(card.answerImage, card.answer);

        return {
          ...card,
          questionWidth: questionSize[0],
          questionHeight: questionSize[1],
          answerWidth: answerSize[0],
          answerHeight: answerSize[1]
        };
      });

      ReactDOM.render(null, containerRef);

      const containerRect = containerRef.getBoundingClientRect();

      dispatch(
        initializeGame(
          match_game_id,
          cardsData,
          Math.floor(containerRect.width) - 10,
          Math.floor(containerRect.height) - 10
        )
      );
      dispatch(placeCards());
    }
  }, [cards, containerRef, flashcardId]);

  const loadStats = useCallback(async () => {
    setIsLoadingStat(true);
    setMatchStat(await apiGetMatchStats(flashcardId));
    setIsLoadingStat(false);
  }, [flashcardId]);

  const finishMatchGame = useCallback(async () => {
    if (logs.length > 0) {
      await apiSaveMatchGameRecords(flashcardId, matchGameId, logs);
    }
    await apiEndMatchGame(flashcardId, matchGameId, matchStartTime.utc().valueOf(), lastRecordTime.utc().valueOf(), elapsedSeconds);
  }, [logs, flashcardId, matchGameId, matchStartTime, lastRecordTime, elapsedSeconds]);

  // Effects
  useEffect(() => {
    setIsStartupModalOpen(true);
  }, [cards]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (matchCards.length > 0 && correctCount < matchCards.length / 2) {
        setLastRecordTime(moment());
      }
    }, TIMER_INTERVAL);
    return () => clearInterval(intervalId);
  }, [matchCards, correctCount]);

  useEffect(() => {
    const func = async () => {
      if (logs.length > 4) {
        const { logged } = await apiSaveMatchGameRecords(flashcardId, matchGameId, logs);
        if (logged) {
          dispatch(removeLogs(logs.length));
        }
      }
    };
    func();
  }, [logs, dispatch, flashcardId, matchGameId]);

  // Event Handlers
  const handleExpand = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const handleCorrectDrop = useCallback((index1, index2) => {
    setCardAnimationData({
      cardData: [index1, index2],
      animationType: ANIMATION_TYPES.CORRECT
    });
    setTimeout(() => {
      setCardAnimationData({
        cardData: null,
        animationType: null
      });
      if (matchCards.length - 2 === correctCount * 2) {
        loadStats();
        finishMatchGame();
      }
      else if (lastIndex - 2 <= correctCount * 2) {
        dispatch(placeCards())
      }
      dispatch(dragCardCorrect(index1, index2));
      dispatch(recordDraggedCards(index1, index2));
    }, ANIMATION_DURATION);
  }, [dispatch, correctCount, lastIndex, finishMatchGame, matchCards.length, loadStats]);

  const handleIncorrectDrop = useCallback((index1, index2) => {
    setCardAnimationData({
      cardData: [index1, index2],
      animationType: ANIMATION_TYPES.INCORRECT
    });
    setTimeout(() => {
      setCardAnimationData({
        cardData: null,
        animationType: null
      });
      dispatch(dragCardIncorrect());
      dispatch(recordDraggedCards(index1, index2));
    }, ANIMATION_DURATION);
  }, [dispatch]);

  const handleClose = useCallback(() => {
    finishMatchGame();
    onClose();
  }, [onClose, finishMatchGame]);

  const handleCloseStartupModal = useCallback(() => {
    setIsStartupModalOpen(false);
    handleClose();
  }, [handleClose]);

  const handleStartMatchGame = useCallback(() => {
    setIsStartupModalOpen(false);
    initializeMatchGame();
  }, [initializeMatchGame]);

  const handleOpenShareModal = useCallback(() => {
    setIsShareModalOpen(true);
  }, []);

  const handleCloseShareModal = useCallback(() => setIsShareModalOpen(false), []);

  const handleStartOver = useCallback(() => {
    if (isFinished) {
      initializeMatchGame();
    } else {
      setIsRestartModalOpen(true);
    }
  }, [initializeMatchGame, isFinished]);

  const handleCloseRestartModal = useCallback(() => setIsRestartModalOpen(false), []);

  const handleRestart = useCallback(() => {
    setIsRestartModalOpen(false);
    initializeMatchGame();
  }, [initializeMatchGame]);

  // Rendering Helpers
  const renderSidebar = () => (
    <Box className={clsx(classes.sidebar, !isExpanded && classes.hidden)}>
      <Box mb={3}>
        <Link
          component="button"
          onClick={handleClose}
          color="inherit"
          variant="h5"
          underline="none"
        >
          <IconBack className={classes.iconMiddle} /> Back
        </Link>
      </Box>
      <Box display="flex" alignItems="center" mt={4}>
        <Box mr={2}>
          <IconNote />
        </Box>
        <Typography variant="h5">
          Match Magic
        </Typography>
      </Box>
      <Box mt={4}>
        <SidebarCard
          title="Running Time"
          text={(
            <Typography variant="h4">
              { matchStartTime && lastRecordTime &&
                (moment
                  .duration(lastRecordTime.diff(matchStartTime))
                  .as('milliseconds') / 1000
                ).toFixed(1)
              }
              { (!matchStartTime || !lastRecordTime) && '0.0' }
              <Typography className={classes.cardSubText}>
                sec
              </Typography>
            </Typography>
          )}
        />
      </Box>
      <Box mt={2}>
        <SidebarCard
          title="Correct Matches"
          text={(
            <Typography variant="h4" className={classes.textSuccess}>
              {correctCount}
            </Typography>
          )}
        />
      </Box>
      <Box mt={2}>
        <SidebarCard
          title="Incorrect Matches"
          text={(
            <Typography variant="h4" className={classes.textDanger}>
              {incorrectCount}
            </Typography>
          )}
        />
      </Box>
      <IconButton
        className={clsx(classes.sidebarButton, classes.expandButton)}
        onClick={handleExpand}
      >
        <IconLeft />
      </IconButton>
    </Box>
  );

  const renderCard = (card, index) => {
    if (!card.visible) return null;

    return (
      <DraggableCard
        key={`${card.cardId}-${card.cardType}`}
        text={card.contentText}
        image={card.contentImage}
        cardId={card.cardId}
        index={index}
        x={card.x}
        y={card.y}
        hasCorrectAnimation={
          cardAnimationData.animationType === ANIMATION_TYPES.CORRECT &&
          cardAnimationData.cardData.includes(index)
        }
        hasIncorrectAnimation={
          cardAnimationData.animationType === ANIMATION_TYPES.INCORRECT &&
          cardAnimationData.cardData.includes(index)
        }
        onCorrectDrop={handleCorrectDrop}
        onIncorrectDrop={handleIncorrectDrop}
      />
    );
  };

  const renderContent = () => (
    <DndProvider backend={HTML5Backend}>
      <div ref={setContainerRef} className={clsx(classes.contentBox, isFinished && classes.hidden)}>
        {matchCards.map((card, index) => renderCard(card, index))}
      </div>
    </DndProvider>
  );

  const renderFinished = () => {
    if (isFinished && isLoadingStat) {
      return <LoadingSpin />;
    }

    const { high_score } = matchStat;

    return (
      <Box padding={4} mt={4} className={clsx(!isFinished && classes.hidden)}>
        <Typography variant="h4" align="center">
          Congrats on Completing Match Magic, {me.firstName}!&nbsp;
          <span role="img" aria-label="Clap">👏</span>
        </Typography>
        <Box display="flex" justifyContent="center" mt={3} mb={3} alignItems="center">
          <Box>
            <Typography align="center" paragraph>
              Last High Score
            </Typography>
            <Typography variant="h2" align="center">
              {!high_score && '--'}
              {high_score && formatSeconds(high_score)}
              {high_score && (
                <Typography className={classes.cardSubText}>
                  min
                </Typography>
              )}
            </Typography>
          </Box>
          <Box>
            <img src={GifCongrats} alt="Trophy" className={classes.congratsGif} />
          </Box>
          <Box>
            <Typography align="center" paragraph>
              {!high_score && 'New High Score'}
              {high_score && 'Today\'s Score'}

              {high_score && high_score > elapsedSeconds &&
                <img src={IconDown} alt="Icon Down" className={classes.scoreImage} />
              }
              {high_score && high_score < elapsedSeconds &&
                <img src={IconUp} alt="Icon Up" className={classes.scoreImage} />
              }
            </Typography>
            <Typography
              variant="h2"
              align="center"
              className={
                clsx(
                  (!high_score || high_score > elapsedSeconds) && classes.highScoreText
                )
              }
            >
              {formatSeconds(elapsedSeconds)}
              <Typography className={classes.cardSubText}>
                min
              </Typography>
            </Typography>
          </Box>
        </Box>
        <Typography variant="h6" align="center" paragraph>
          {!high_score &&
            'Hooray for your first time playing with this deck! New high score!'
          }
          {high_score && high_score <= elapsedSeconds &&
            'Almost there! Beat your time by playing again!'
          }
          {high_score && high_score > elapsedSeconds &&
            `You beat your personal record by ${formatSeconds(high_score - elapsedSeconds)} min!`
          }
        </Typography>
        <Typography align="center">
          {!high_score && 'Play again and beat your personal record!'}
          {
            high_score && high_score <= elapsedSeconds &&
            'Practice, practice, practice, and you’ll do even better next time!'
          }
          {high_score && high_score > elapsedSeconds &&
            'High five! Your hard work is paying off! 🙌'
          }
        </Typography>
        <Typography align="center" paragraph>
          {!high_score && 'Get faster and keep playing or share it with classmates too!'}
          {high_score && high_score <= elapsedSeconds &&
            'Get faster and keep playing or share it with classmates too!'
          }
          {high_score && high_score > elapsedSeconds &&
            'Get even faster and keep playing or share it with classmates too!'
          }
        </Typography>
        <Box display="flex" justifyContent="center">
          <TransparentButton
            startIcon={<IconShare />}
            onClick={handleOpenShareModal}
          >
            Share this Flashcard Deck with Classmates
          </TransparentButton>
        </Box>
      </Box>
    );
  };

  return (
    <Box position="relative">
      <Slide in={isExpanded} direction="right">
        { renderSidebar() }
      </Slide>
      <Box className={clsx(classes.mainContent, isExpanded && 'expanded')}>
        <Box display="flex" justifyContent="flex-end" className={classes.actionBar}>
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
        { renderContent() }
        { renderFinished() }
      </Box>
      <StartupModal
        open={isStartupModalOpen}
        onClose={handleCloseStartupModal}
        onStart={handleStartMatchGame}
      />
      <Dialog
        okTitle="Yes"
        onCancel={handleCloseRestartModal}
        onOk={handleRestart}
        open={isRestartModalOpen}
        showActions
        showCancel
        title="Start Over"
      >
        If you Start Over, then you'll reset your progress. Are you sure you want to restart?
      </Dialog>
      <ShareLinkModal
        open={isShareModalOpen}
        link={`${APP_ROOT_PATH}/flashcards/${flashcardId}`}
        title={(
          <Typography variant="h6">
            <span role="img" aria-label="Two hands">🙌</span>
            &nbsp; You’re awesome for helping your peers! Ready to share a link to your <b>{ flashcardTitle }</b> deck?
          </Typography>
        )}
        onClose={handleCloseShareModal}
      />
      { !isExpanded && (
        <IconButton
          className={clsx(classes.expandButton, classes.bodyButton)}
          onClick={handleExpand}
        >
          <IconRight />
        </IconButton>
      )}
    </Box>
  );
};

FlashcardsMatchGame.propTypes = {
  cards: PropTypes.array.isRequired,
  flashcardId: PropTypes.string.isRequired,
  flashcardTitle: PropTypes.string,
  onClose: PropTypes.func
};

FlashcardsMatchGame.defaultProps = {
  flashcardTitle: '',
  onClose: () => {}
};

export default withRoot(FlashcardsMatchGame);
