import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef
} from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import IconSchool from '@material-ui/icons/School';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import IconLeft from '@material-ui/icons/ArrowBack';
import IconRight from '@material-ui/icons/ArrowForward';
import Slide from '@material-ui/core/Slide';
import clsx from 'clsx';
import {
  arrElemToId,
  englishIdFromNumber,
  extractTextFromHtml,
  shuffleArray
} from 'utils/helpers';
import update from 'immutability-helper';
import Grid from '@material-ui/core/Grid';
import { Select } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import _ from 'lodash';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ChoiceRadio from 'components/FlashcardsQuiz/ChoiceRadio';
import GradientButton from 'components/Basic/Buttons/GradientButton';
import IconCheck from '@material-ui/icons/Check';
import ImageCorrect from 'assets/svg/answer-correct.svg';
import ImageWrong from 'assets/svg/answer-wrong.svg';
import IconRetry from '@material-ui/icons/Replay';
import Timer, { TIMER_STATUS } from 'components/Timer';
import Link from '@material-ui/core/Link';
import IconBack from '@material-ui/icons/ChevronLeft';
import ImageDialog from 'components/ImageDialog';
import { TIMEOUT } from 'constants/common';
import { useIdleTimer } from 'react-idle-timer';
import { logEvent } from 'api/analytics';
import { differenceInMilliseconds } from 'date-fns';
import { INTERVAL } from 'constants/app';
import Button from '@material-ui/core/Button';
import IconClose from '@material-ui/icons/Close';
import useStyles from './styles';
import withRoot from '../../withRoot';

const PROBLEM_COUNT_THRESHOLD = 3;
const MULTIPLE_CHOICE_OPTIONS_COUNT = 4;
const timeout = TIMEOUT.FLASHCARD_REVEIW;

const FlashcardsQuiz = ({ cards, flashcardId, onClose }) => {
  const classes = useStyles();
  const [isExpanded, setIsExpanded] = useState(true);
  const [quizData, setQuizData] = useState({
    match: {
      qPositions: [],
      qIds: [],
      aPositions: [],
      aIds: []
    },
    choice: []
  });
  const [matchSelections, setMatchSelections] = useState([]);
  const [choiceSelections, setChoiceSelections] = useState([]);
  const [isValidated, setIsValidated] = useState(false);
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [timerStatus, setTimerStatus] = useState(TIMER_STATUS.INITIALIZED);

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
  }, [flashcardId, getElapsedTime, getLastActiveTime, getRemainingTime]);

  const initializeTimer = useCallback(() => {
    elapsed.current = 0;
    totalIdleTime.current = 0;
    remaining.current = timeout;
    lastActive.current = new Date();
  }, [elapsed, totalIdleTime, remaining, lastActive]);

  // Memos
  const dropdownOptions = useMemo(() => {
    return [...new Array(quizData.match.qIds.length).keys()].map((id) => ({
      value: id + 1,
      text: String.fromCharCode('A'.charCodeAt(0) + id)
    }));
  }, [quizData]);

  const unansweredCount = useMemo(() => {
    let result = 0;

    for (let i = quizData.match.qIds.length - 1; i >= 0; i -= 1) {
      if (matchSelections[i] === undefined) result += 1;
    }

    for (let i = quizData.choice.length - 1; i >= 0; i -= 1) {
      if (choiceSelections[quizData.choice[i].qId] === undefined) result += 1;
    }

    return result;
  }, [choiceSelections, matchSelections, quizData]);

  // Callbacks
  const initQuizData = useCallback((count) => {
    if (count < 1)
      throw new Error('Number of cards should be greater than zero');

    const matchCount = _.min([
      _.max([PROBLEM_COUNT_THRESHOLD, Math.ceil(count / 2)]),
      count
    ]);

    const arrIdx = [...new Array(matchCount).keys()];
    const arr1 = shuffleArray(arrIdx);
    const arr2 = shuffleArray(arrIdx);

    const choiceCount = _.min([
      _.max([PROBLEM_COUNT_THRESHOLD, Math.floor(count / 2)]),
      count
    ]);
    const optionCount = _.min([choiceCount, MULTIPLE_CHOICE_OPTIONS_COUNT]);
    const choiceData = [];
    const arrChoiceIdx = [...new Array(choiceCount).keys()].map(
      (i) => i + count - choiceCount
    );
    const arr3 = shuffleArray(arrChoiceIdx);

    for (let i = 0; i < choiceCount; i += 1) {
      const arrExceptQid = [...arr3];
      arrExceptQid.splice(i, 1);

      const arr = shuffleArray(arrExceptQid);
      const optionsArr = arr.slice(0, optionCount - 1);

      optionsArr.push(arr3[i]);
      choiceData.push({
        qId: arr3[i],
        options: shuffleArray(optionsArr).map((id) => id + 1)
      });
    }

    setQuizData((data) =>
      update(data, {
        match: {
          qIds: { $set: arr1 },
          qPositions: { $set: arrElemToId(arr1) },
          aIds: { $set: arr2 },
          aPositions: { $set: arrElemToId(arr2) }
        },
        choice: { $set: choiceData }
      })
    );

    setMatchSelections([]);
    setChoiceSelections([]);
  }, []);

  // Effects
  useEffect(() => {
    initQuizData(cards.length);
  }, [cards, initQuizData]);

  // Event Handlers
  const handleExpand = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const handleMatchSelectAnswer = useCallback((id, value) => {
    setMatchSelections((data) =>
      update(data, {
        [id]: { $set: value }
      })
    );
  }, []);

  const handleChoiceSelectAnswer = useCallback((id, value) => {
    setChoiceSelections((data) =>
      update(data, {
        [id]: { $set: value }
      })
    );
  }, []);

  const handleCheckAnswers = useCallback(() => {
    setIsValidated(true);
    setTimerStatus(TIMER_STATUS.INITIALIZED);
  }, []);

  const handleRetryQuiz = useCallback(() => {
    setIsValidated(false);
    initQuizData(cards.length);
    setTimerStatus(TIMER_STATUS.STARTED);
  }, [initQuizData, cards]);

  const handleBack = useCallback(() => {
    try {
      clearInterval(timer.current);
      logEvent({
        event: 'Flashcard Quiz- Exited',
        props: {
          flashcardId,
          elapsed: elapsed.current,
          total_idle_time: totalIdleTime.current,
          effective_time: elapsed.current - totalIdleTime.current,
          platform: 'Web'
        }
      });
      reset();
      initializeTimer();
    } catch (err) {}

    onClose();
  }, [onClose, elapsed, totalIdleTime, flashcardId, reset, initializeTimer]);

  const handleViewImage = useCallback((event, imageUrl) => {
    event.preventDefault();
    event.stopPropagation();

    setPreviewImage(imageUrl);
    setImageModalOpen(true);
  }, []);

  const handleCloseImageModal = useCallback(() => {
    setImageModalOpen(false);
  }, []);

  // Rendering Helpers
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
          onClick={handleBack}
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
        <Typography variant="h5">Quiz Yourself</Typography>
      </Box>
      <Box mt={4}>
        <Timer defaultStatus={timerStatus} />
      </Box>
      <IconButton
        className={clsx(classes.sidebarButton, classes.expandButton)}
        onClick={handleExpand}
      >
        {isExpanded ? <IconLeft /> : <IconRight />}
      </IconButton>
    </Box>
  );

  const renderImageIcon = (imageUrl) => {
    if (!imageUrl) return null;

    return (
      <img
        src={imageUrl}
        className={classes.iconImage}
        alt="Flashcard Thumbnail"
        onClick={(event) => handleViewImage(event, imageUrl)}
      />
    );
  };

  const renderMatching = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} lg={6}>
        {quizData.match.qIds.map((id, index) => (
          <Box display="flex" alignItems="center" key={id} mb={2}>
            <div className={classes.checkIconContainer}>
              {isValidated && (
                <img
                  className={classes.checkImage}
                  src={
                    matchSelections[id] - 1 !== quizData.match.aPositions[id]
                      ? ImageWrong
                      : ImageCorrect
                  }
                  alt="Check Answer Icon"
                />
              )}
            </div>
            <Select
              className={clsx(
                classes.matchQuestionSelect,
                isValidated &&
                  matchSelections[id] - 1 === quizData.match.aPositions[id] &&
                  classes.correctBackground,
                isValidated &&
                  matchSelections[id] - 1 !== quizData.match.aPositions[id] &&
                  classes.wrongBackground
              )}
              classes={{
                disabled: classes.textWhite
              }}
              onChange={(event) =>
                handleMatchSelectAnswer(id, event.target.value)
              }
              value={matchSelections[id] || ''}
              disabled={isValidated}
            >
              {dropdownOptions.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.text}
                </MenuItem>
              ))}
            </Select>
            <Typography className={classes.matchQuestionText}>
              <b>{index + 1}.&nbsp;</b>
              {renderImageIcon(cards[id].questionImage)}
              {extractTextFromHtml(cards[id].question)}
            </Typography>
          </Box>
        ))}
      </Grid>
      <Grid item xs={12} lg={6}>
        {quizData.match.aIds.map((id, index) => (
          <Box key={id} mb={2}>
            <Typography>
              <b>{englishIdFromNumber(index)}.&nbsp;</b>
              {renderImageIcon(cards[id].answerImage)}
              {extractTextFromHtml(cards[id].answer)}
            </Typography>
          </Box>
        ))}
      </Grid>
    </Grid>
  );

  const renderMultipleChoice = () => (
    <Grid container direction="column" spacing={2}>
      {quizData.choice.map((item, index) => (
        <Grid item key={item.qId}>
          <Typography paragraph>
            <b>
              {index + 1}. {renderImageIcon(cards[item.qId].questionImage)}{' '}
              {extractTextFromHtml(cards[item.qId].question)}
            </b>
          </Typography>
          <RadioGroup
            onChange={(event) =>
              handleChoiceSelectAnswer(item.qId, parseInt(event.target.value))
            }
            value={choiceSelections[item.qId] || ''}
            name={`question-${item.qId}`}
          >
            {item.options.map((id) => (
              <Box key={id} display="flex" alignItems="center" mb={1}>
                <div className={classes.checkIconContainer}>
                  {isValidated && item.qId === id - 1 && (
                    <img
                      src={ImageCorrect}
                      alt="Correct Icon"
                      className={classes.checkImage}
                    />
                  )}
                  {isValidated &&
                    choiceSelections[item.qId] === id &&
                    item.qId !== id - 1 && (
                      <img
                        src={ImageWrong}
                        alt="Wrong Icon"
                        className={classes.checkImage}
                      />
                    )}
                </div>
                <Box
                  flexGrow={1}
                  className={clsx(
                    isValidated &&
                      item.qId === id - 1 &&
                      classes.correctBackground,
                    isValidated &&
                      choiceSelections[item.qId] === id &&
                      item.qId !== id - 1 &&
                      classes.wrongBackground
                  )}
                >
                  <FormControlLabel
                    value={id}
                    control={<ChoiceRadio />}
                    label={
                      <>
                        {renderImageIcon(cards[id - 1].answerImage)}
                        {extractTextFromHtml(cards[id - 1].answer)}
                      </>
                    }
                    disabled={isValidated}
                    className={classes.choiceRadio}
                    classes={{
                      disabled: classes.textWhite
                    }}
                  />
                </Box>
              </Box>
            ))}
          </RadioGroup>
        </Grid>
      ))}
    </Grid>
  );

  const renderContent = () => (
    <div className={classes.contentBox}>
      <div className={clsx(classes.sectionTitle, classes.firstSection)}>
        <Typography variant="h6">Matching</Typography>
        <Typography>
          Match the questions on the left with the answers on the right.
        </Typography>
      </div>
      <div className={classes.matchContainer}>{renderMatching()}</div>
      <div className={classes.sectionTitle}>
        <Typography variant="h6">Multiple Choice</Typography>
        <Typography>Select the best answer from the given options.</Typography>
      </div>
      <div className={classes.choiceContainer}>{renderMultipleChoice()}</div>
      <Box pl={4} mt={3} display="flex" alignItems="center">
        {!isValidated && (
          <>
            <GradientButton
              startIcon={<IconCheck />}
              onClick={handleCheckAnswers}
              disabled={unansweredCount > 0}
            >
              Check Your Answers
            </GradientButton>
            {unansweredCount > 0 && (
              <Box ml={3}>
                <Typography color="error">
                  {unansweredCount} unanswered questions. Answer all questions
                  to submit.
                </Typography>
              </Box>
            )}
          </>
        )}
        {isValidated && (
          <GradientButton startIcon={<IconRetry />} onClick={handleRetryQuiz}>
            Try Again
          </GradientButton>
        )}
      </Box>
    </div>
  );

  return (
    <Box position="relative">
      <Slide in={isExpanded} direction="right">
        {renderSidebar()}
      </Slide>
      <Box className={clsx(classes.mainContent, isExpanded && 'expanded')}>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            startIcon={<IconClose />}
            className={classes.actionButton}
            onClick={handleBack}
          >
            Exit Mode
          </Button>
        </Box>
        {renderContent()}
      </Box>
      <ImageDialog
        open={isImageModalOpen}
        imageUrl={previewImage}
        onClose={handleCloseImageModal}
      />
    </Box>
  );
};

FlashcardsQuiz.propTypes = {
  flashcardId: PropTypes.number.isRequired,
  cards: PropTypes.array.isRequired,
  onClose: PropTypes.func
};

FlashcardsQuiz.defaultProps = {
  onClose: () => {}
};

export default withRoot(FlashcardsQuiz);
