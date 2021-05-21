import React, { useCallback, useEffect, useMemo, useState } from 'react';
import withRoot from '../../withRoot';
import useStyles from './styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import IconSchool from '@material-ui/icons/School';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import IconLeft from '@material-ui/icons/ArrowBack';
import IconRight from '@material-ui/icons/ArrowForward';
import Slide from '@material-ui/core/Slide';
import clsx from 'clsx';
import { arrElemToId, englishIdFromNumber, extractTextFromHtml, shuffleArray } from 'utils/helpers';
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
import Timer from 'components/Timer';
import Link from '@material-ui/core/Link';
import IconBack from '@material-ui/icons/ChevronLeft';
import IconImage from '@material-ui/icons/CropOriginal';
import ImageDialog from 'components/ImageDialog';

const MULTIPLE_CHOICE_PROBLEM_COUNT = 3;
const MULTIPLE_CHOICE_OPTIONS_COUNT = 4;

const FlashcardsQuiz = ({ cards, onClose }) => {
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

  // Memos
  const dropdownOptions = useMemo(() => {
    return [...new Array(cards.length).keys()].map((id) => ({
      value: id + 1,
      text: String.fromCharCode('A'.charCodeAt(0) + id)
    }))
  }, [cards]);

  const unansweredCount = useMemo(() => {
    let result = 0;

    for (let i = cards.length - 1; i >= 0 ; -- i) {
      if (matchSelections[i] === undefined) result += 1;
    }

    for (let i = quizData.choice.length - 1; i >= 0; -- i) {
      if (choiceSelections[quizData.choice[i].qId] === undefined) result += 1;
    }

    return result;
  }, [choiceSelections, matchSelections, cards, quizData]);

  // Callbacks
  const initQuizData = useCallback((count) => {
    if (count < 1) throw new Error('Number of cards should be greater than zero');

    const arrIdx = [...new Array(count).keys()];
    const arr1 = shuffleArray(arrIdx);
    const arr2 = shuffleArray(arrIdx);
    const arr3 = shuffleArray(arrIdx);

    const choiceCount = _.min([count, MULTIPLE_CHOICE_PROBLEM_COUNT]);
    const optionCount = _.min([count, MULTIPLE_CHOICE_OPTIONS_COUNT]);

    const choiceData = [];

    for (let i = 0; i < choiceCount; ++ i) {
      const arrExceptQid = [...arrIdx];
      arrExceptQid.splice(arr3[i], 1);

      const arr = shuffleArray(arrExceptQid);
      const optionsArr = arr.slice(0, optionCount - 1);

      optionsArr.push(arr3[i]);
      choiceData.push({
        qId: arr3[i],
        options: shuffleArray(optionsArr).map((id) => id + 1)
      });
    }

    setQuizData((data) => update(data, {
      match: {
        qIds: { $set: arr1 },
        qPositions: { $set: arrElemToId(arr1) },
        aIds: { $set: arr2 },
        aPositions: { $set: arrElemToId(arr2) }
      },
      choice: { $set: choiceData }
    }));

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
    setMatchSelections((data) => update(data, {
      [id]: { $set: value }
    }));
  }, []);

  const handleChoiceSelectAnswer = useCallback((id, value) => {
    setChoiceSelections((data) => update(data, {
      [id]: { $set: value }
    }));
  }, []);

  const handleCheckAnswers = useCallback(() => {
    setIsValidated(true);
  }, []);

  const handleRetryQuiz = useCallback(() => {
    setIsValidated(false);
    initQuizData(cards.length);
  }, [initQuizData, cards]);

  const handleBack = useCallback(() => {
    onClose();
  }, [onClose]);

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
    <Box className={clsx(classes.sidebar, !isExpanded && classes.hidden)}>
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
        <Typography variant="h5">
          Quiz Yourself
        </Typography>
      </Box>
      <Box mt={4}>
        <Timer />
      </Box>
      <IconButton
        className={clsx(classes.sidebarButton, classes.expandButton)}
        onClick={handleExpand}
      >
        <IconLeft />
      </IconButton>
    </Box>
  );

  const renderImageIcon = (imageUrl) => {
    if (!imageUrl) return null;

    return (
      <IconImage
        className={classes.iconImage}
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
              { isValidated && (
                <img
                  className={classes.checkImage}
                  src={
                    matchSelections[id] - 1 !== quizData.match.aPositions[id] ?
                      ImageWrong :
                      ImageCorrect
                  }
                  alt="Check Answer Icon"
                />
              )}
            </div>
            <Select
              className={clsx(
                classes.matchQuestionSelect,
                isValidated && matchSelections[id] - 1 === quizData.match.aPositions[id] && classes.correctBackground,
                isValidated && matchSelections[id] - 1 !== quizData.match.aPositions[id] && classes.wrongBackground,
              )}
              classes={{
                disabled: classes.textWhite
              }}
              onChange={(event) => handleMatchSelectAnswer(id, event.target.value)}
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
              <b>{ index + 1 }.&nbsp;</b>
              {extractTextFromHtml(cards[id].question)}
              {renderImageIcon(cards[id].questionImage)}
            </Typography>
          </Box>
        ))}
      </Grid>
      <Grid item xs={12} lg={6}>
        {quizData.match.aIds.map((id, index) => (
          <Box key={id} mb={2}>
            <Typography>
              <b>{ englishIdFromNumber(index) }.&nbsp;</b>
              {extractTextFromHtml(cards[id].answer)}
              {renderImageIcon(cards[id].answerImage)}
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
            <b>{ index + 1 }. {extractTextFromHtml(cards[item.qId].question)}</b>
            {renderImageIcon(cards[item.qId].questionImage)}
          </Typography>
          <RadioGroup
            onChange={(event) => handleChoiceSelectAnswer(item.qId, parseInt(event.target.value))}
            value={choiceSelections[item.qId] || ''}
            name={`question-${item.qId}`}
          >
            {item.options.map((id) => (
              <Box key={id} display="flex" alignItems="center" mb={1}>
                <div className={classes.checkIconContainer}>
                  {isValidated && item.qId === id - 1 && (
                    <img src={ImageCorrect} alt="Correct Icon" className={classes.checkImage} />
                  )}
                  {isValidated && choiceSelections[item.qId] === id && item.qId !== id - 1 && (
                    <img src={ImageWrong} alt="Wrong Icon" className={classes.checkImage} />
                  )}
                </div>
                <Box
                  flexGrow={1}
                  className={clsx(
                    isValidated && item.qId === id - 1 && classes.correctBackground,
                    isValidated && choiceSelections[item.qId] === id && item.qId !== id - 1 && classes.wrongBackground
                  )}
                >
                  <FormControlLabel
                    value={id}
                    control={<ChoiceRadio />}
                    label={
                      <>
                        {extractTextFromHtml(cards[id - 1].answer)}
                        {renderImageIcon(cards[id - 1].answerImage)}
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
        <Typography variant="h6">
          Matching
        </Typography>
        <Typography>
          Match the questions on the left with the answers on the right.
        </Typography>
      </div>
      <div className={classes.matchContainer}>
        { renderMatching() }
      </div>
      <div className={classes.sectionTitle}>
        <Typography variant="h6">
          Multiple Choice
        </Typography>
        <Typography>
          Select the best answer from the given options.
        </Typography>
      </div>
      <div className={classes.choiceContainer}>
        { renderMultipleChoice() }
      </div>
      <Box pl={4} mt={3} display="flex" alignItems="center">
        {!isValidated && (
          <>
            <GradientButton
              startIcon={<IconCheck />} onClick={handleCheckAnswers}
              disabled={unansweredCount > 0}
            >
              Check Your Answers
            </GradientButton>
            {unansweredCount > 0 && (
              <Box ml={3}>
                <Typography>
                  { unansweredCount } unanswered questions.
                </Typography>
              </Box>
            )}
          </>
        )}
        {isValidated && (
          <GradientButton
            startIcon={<IconRetry />}
            onClick={handleRetryQuiz}
          >
            Try Again
          </GradientButton>
        )}
      </Box>
    </div>
  );

  return (
    <Box position="relative">
      <Slide in={isExpanded} direction="right">
        { renderSidebar() }
      </Slide>
      <Box className={clsx(classes.mainContent, isExpanded && 'expanded')}>
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
