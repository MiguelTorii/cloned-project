/* eslint-disable react/no-danger */
/* eslint-disable camelcase */
// @flow
import React, { useCallback, useState, useEffect } from 'react';
import sanitizeHtml from 'sanitize-html';
import uuidv4 from 'uuid/v4';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

import Dialog from 'components/Dialog/Dialog';
import { saveQuizAnswers, generateQuiz } from 'api/feed';

import { useStyles } from '../_styles/FlashcardQuiz';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const createMarkup = (html) => {
  return { __html: sanitizeHtml(html) };
};

type Props = {
  flashcardId: number,
  isOpen: boolean
};

const FlashcardQuiz = ({ flashcardId, isOpen }: Props) => {
  const classes = useStyles();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [multiQuestions, setMultiQuestions] = useState([]);
  const [isEvaluationMode, setIsEvaluationMode] = useState(false);
  const [score, setScore] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [dialogImageUrl, setDialogImageUrl] = useState('');
  const [isPhotoExpanded, setIsPhotoExpanded] = useState({});

  const generateNewQuiz = useCallback(async () => {
    const result = await generateQuiz({ deckId: flashcardId });
    const initialQuestions = result.matching.questions.map((q) => ({
      ...q,
      answerId: '',
      uuid: uuidv4()
    }));
    const initialAnswers = result.matching.answers.map((a) => ({
      ...a,
      available: true,
      uuid: uuidv4()
    }));
    const initialMultiQuestions = result.multiple_choice.question.map((q) => ({
      ...q,
      answerId: '',
      uuid: uuidv4(),
      answers: q.answers.map((an) => ({ ...an, uuid: uuidv4() }))
    }));

    setQuestions(initialQuestions);
    setAnswers(initialAnswers);
    setMultiQuestions(initialMultiQuestions);
    setQuiz(result);
  }, [flashcardId]);

  useEffect(() => {
    const init = async () => {
      await generateNewQuiz();
    };

    init();
  }, [generateNewQuiz, isOpen]);

  if (!quiz) return <div>Loading...</div>;

  const onAnswerChange = ({ currentAnswerId, newAnswerId, questionId }) => {
    if (isQuizCompleted) return;

    const updatedAnswers = answers.map((a) => {
      if (a.id === currentAnswerId) {
        return { ...a, available: true };
      }
      if (a.id === newAnswerId) {
        return { ...a, available: false };
      }
      return a;
    });

    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId) {
        return { ...q, answerId: newAnswerId };
      }
      return q;
    });

    setAnswers(updatedAnswers);
    setQuestions(updatedQuestions);
  };

  const Question = ({
    question: { answerId, id, question, question_image_url, uuid }
  }) => {
    const isAnswerCorrect = answerId === id;
    let color = 'white';

    if (isEvaluationMode) {
      color = isAnswerCorrect ? '#60b515' : '#f54f47';
    }

    const photoExpanded = isPhotoExpanded[uuid];

    return (
      <div className={classes.question}>
        <div className={classes.questionSelect}>
          {isEvaluationMode &&
            (isAnswerCorrect ? (
              <CheckIcon
                classes={{ root: classes.resultIcon2 }}
                style={{ fill: '#60b515', fontSize: 20 }}
              />
            ) : (
              <CloseIcon
                classes={{ root: classes.resultIcon2 }}
                style={{ fill: '#f54f47', fontSize: 20 }}
              />
            ))}
          <Select
            id="select-question"
            labelId="select-question-label"
            onChange={(event) =>
              onAnswerChange({
                currentAnswerId: answerId,
                newAnswerId: event.target.value,
                questionId: id
              })
            }
            style={{ color, paddingLeft: 8, marginLeft: 8, width: 50 }}
            value={answerId}
          >
            {answers.map(
              (answer, i) =>
                (answer.available !== false || answer.id === answerId) && (
                  <MenuItem key={answer.id} value={answer.id}>
                    {alphabet.split('')[i]}
                  </MenuItem>
                )
            )}
          </Select>
        </div>
        <div className={classes.questionContent}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              className={classes.questionText}
              dangerouslySetInnerHTML={createMarkup(question)}
            />
            {question && question_image_url && (
              <>
                <div
                  className={classes.link}
                  onKeyUp={() => {}}
                  onClick={() => {
                    setIsPhotoExpanded({
                      ...isPhotoExpanded,
                      [uuid]: !photoExpanded
                    });
                  }}
                  role="button"
                  tabIndex={0}
                >
                  {photoExpanded ? 'Hide Photo' : 'View Photo'}
                </div>
              </>
            )}
          </div>
          {question_image_url && (photoExpanded || !question) && (
            <div
              className={classes.media}
              onKeyUp={() => {}}
              tabIndex={0}
              role="button"
              onClick={() => {
                setDialogImageUrl(question_image_url);
                setIsImageDialogOpen(true);
              }}
            >
              <img
                className={classes.image}
                src={question_image_url}
                alt={question}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const Answer = ({ answer: { answer, answer_image_url, uuid }, char }) => {
    const photoExpanded = isPhotoExpanded[uuid];

    return (
      <div className={classes.answer}>
        <div className={classes.answerContent}>
          <div>{`${char}.`}</div>
          <div
            dangerouslySetInnerHTML={createMarkup(answer)}
            style={{ paddingLeft: 8, lineHeight: '32px' }}
          />
          {answer && answer_image_url && (
            <>
              <div
                className={classes.link}
                onKeyUp={() => {}}
                onClick={() => {
                  setIsPhotoExpanded({
                    ...isPhotoExpanded,
                    [uuid]: !photoExpanded
                  });
                }}
                role="button"
                tabIndex={0}
              >
                {photoExpanded ? 'Hide Photo' : 'View Photo'}
              </div>
            </>
          )}
        </div>
        {answer_image_url && (!answer || photoExpanded) && (
          <div className={classes.media}>
            <div
              className={classes.media}
              onKeyUp={() => {}}
              tabIndex={0}
              role="button"
              onClick={() => {
                setDialogImageUrl(answer_image_url);
                setIsImageDialogOpen(true);
              }}
            >
              <img
                className={classes.image}
                src={answer_image_url}
                alt={answer}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const MultiQuestion = ({
    index,
    multiQuestion: { answerId, answers, id, question, question_image_url, uuid }
  }) => {
    const Choice = ({
      answer: {
        answer_image_url: option_image_url,
        answer: optionText,
        id: optionId,
        uuid
      },
      index
    }) => {
      const isAnswerCorrect = optionId === id;
      const isSelected = optionId === answerId;
      const photoExpanded = isPhotoExpanded[uuid];
      let color = '#E9ECEF';

      if (isSelected) {
        color = '#ADBBC4';

        if (isEvaluationMode) {
          color = isAnswerCorrect ? '#60b515' : '#f54f47';
        }
      }

      const onAnswerClicked = (answerId) => {
        if (isQuizCompleted) return;

        const updatedMultiQuestions = multiQuestions.map((mq) => {
          if (mq.id === id) {
            return { ...mq, answerId };
          }

          return mq;
        });

        setMultiQuestions(updatedMultiQuestions);
      };

      return (
        <div>
          <div
            className={classes.choice}
            onClick={() => onAnswerClicked(optionId)}
            onKeyUp={() => onAnswerClicked(optionId)}
            role="button"
            tabIndex={0}
            style={{ color }}
          >
            {isEvaluationMode &&
              isSelected &&
              (isAnswerCorrect ? (
                <CheckIcon
                  classes={{ root: classes.resultIcon }}
                  style={{ fill: '#60b515', fontSize: 20 }}
                />
              ) : (
                <CloseIcon
                  classes={{ root: classes.resultIcon }}
                  style={{ fill: '#f54f47', fontSize: 20 }}
                />
              ))}
            <div>
              {isSelected ? (
                <RadioButtonCheckedIcon
                  classes={{ root: classes.radioIcon }}
                  style={{ fill: color }}
                />
              ) : (
                <RadioButtonUncheckedIcon
                  classes={{ root: classes.radioIcon }}
                  style={{ fill: color }}
                />
              )}
            </div>
            <div>{`${alphabet.split('')[index]}.`}</div>
            <div
              dangerouslySetInnerHTML={createMarkup(optionText)}
              style={{ padding: 0, paddingLeft: 8 }}
            />
            {optionText && option_image_url && (
              <>
                <div
                  className={classes.link}
                  onKeyUp={() => {}}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPhotoExpanded({
                      ...isPhotoExpanded,
                      [uuid]: !photoExpanded
                    });
                  }}
                  role="button"
                  tabIndex={0}
                >
                  {photoExpanded ? 'Hide Photo' : 'View Photo'}
                </div>
              </>
            )}
          </div>
          {option_image_url && (photoExpanded || !optionText) && (
            <div
              className={classes.media}
              onKeyUp={() => {}}
              tabIndex={0}
              role="button"
              onClick={() => {
                setDialogImageUrl(option_image_url);
                setIsImageDialogOpen(true);
              }}
            >
              <img
                className={classes.image}
                src={option_image_url}
                alt={question}
              />
            </div>
          )}
        </div>
      );
    };

    const photoExpanded = isPhotoExpanded[uuid];

    return (
      <div className={classes.multiQuestion}>
        <div className={classes.questionTitle}>
          <span>{`${index}.`}</span>
          <span
            dangerouslySetInnerHTML={createMarkup(question)}
            style={{ paddingLeft: 8 }}
          />
          {question && question_image_url && (
            <>
              <div
                className={classes.link}
                onKeyUp={() => {}}
                onClick={() => {
                  setIsPhotoExpanded({
                    ...isPhotoExpanded,
                    [uuid]: !photoExpanded
                  });
                }}
                role="button"
                tabIndex={0}
              >
                {photoExpanded ? 'Hide Photo' : 'View Photo'}
              </div>
            </>
          )}
        </div>
        {question_image_url && (!question || photoExpanded) && (
          <div
            className={classes.media}
            onKeyUp={() => {}}
            tabIndex={0}
            role="button"
            onClick={() => {
              setDialogImageUrl(question_image_url);
              setIsImageDialogOpen(true);
            }}
          >
            <img
              className={classes.image}
              src={question_image_url}
              alt={question}
            />
          </div>
        )}
        <div className={classes.choices}>
          {answers.map((answer, i) => (
            <Choice key={`${answer.id}-choice`} answer={answer} index={i} />
          ))}
        </div>
      </div>
    );
  };

  const numberOfQuestions = questions.length + multiQuestions.length;
  const numberOfAnsweredMatchingQuestions = questions.filter(
    (q) => q.answerId !== ''
  ).length;
  const numberOfAnsweredMultiQuestions = multiQuestions.filter(
    (q) => q.answerId !== ''
  ).length;

  const canEvaluate =
    numberOfQuestions ===
    numberOfAnsweredMatchingQuestions + numberOfAnsweredMultiQuestions;

  return (
    <Grid item xs={12} md={12}>
      <div className={classes.content}>
        <div className={classes.header}>
          <div className={classes.title}>Matching</div>
          {isEvaluationMode && (
            <div className={classes.title}>{`Score ${score}`}</div>
          )}
        </div>
        <Grid container spacing={2} item xs={12} md={12}>
          <Grid item xs={12} md={6}>
            <div className={classes.subtitle}>
              Match the question with the correct answer
            </div>
            {questions.map((question) => (
              <Question key={`${question.id}-question`} question={question} />
            ))}
          </Grid>
          <Grid item xs={12} md={6}>
            <div className={classes.subtitle}>Answer Bank</div>
            {answers.map((answer, i) => (
              <Answer
                key={`${answer.id}-answer`}
                answer={answer}
                char={alphabet.split('')[i]}
              />
            ))}
          </Grid>
          {multiQuestions.length > 0 && (
            <Grid item xs={12} md={12}>
              <div
                className={classes.title}
                style={{ paddingTop: 24, paddingBottom: 8 }}
              >
                Multiple Choice
              </div>
              <div className={classes.subtitle}>
                Answer these next questions by clicking on the answer you
                believe is correct.
              </div>
              {multiQuestions.map((multiQuestion, i) => (
                <MultiQuestion multiQuestion={multiQuestion} index={i + 1} />
              ))}
            </Grid>
          )}
        </Grid>
      </div>
      <div className={classes.buttons}>
        {!isQuizCompleted ? (
          <Button
            className={classes.button}
            color="primary"
            disabled={!canEvaluate}
            onClick={async () => {
              setIsEvaluationMode(true);
              const numberOfCorrectMatchingQuestions = questions.filter(
                (q) => q.answerId === q.id
              ).length;
              const numberOfCorrectMultiQuestions = multiQuestions.filter(
                (q) => q.answerId === q.id
              ).length;
              setIsQuizCompleted(true);
              document
                .querySelector('[aria-labelledby="circle-in-dialog-content"]')
                .scroll(0, 0);
              setScore(
                `${
                  numberOfCorrectMatchingQuestions +
                  numberOfCorrectMultiQuestions
                } / ${numberOfQuestions}`
              );
              const results = [...questions, ...multiQuestions].map((q) => ({
                question_id: q.id,
                answer_id: q.answerId
              }));
              await saveQuizAnswers({ results });
            }}
            variant="contained"
          >
            Get Results
          </Button>
        ) : (
          <Button
            className={classes.button}
            color="primary"
            disabled={!canEvaluate}
            onClick={() => {
              setIsEvaluationMode(false);
              setIsQuizCompleted(false);
              setQuiz(null);
              generateNewQuiz();
              setIsPhotoExpanded({});
            }}
            variant="contained"
          >
            Try Again
          </Button>
        )}
      </div>
      <Dialog
        open={isImageDialogOpen}
        onCancel={() => {
          setDialogImageUrl('');
          setIsImageDialogOpen(false);
        }}
        aria-labelledby="simple-dialog-title"
        aria-describedby="simple-dialog-description"
      >
        <img
          className={classes.dialogImage}
          src={dialogImageUrl}
          alt="dialog"
        />
      </Dialog>
    </Grid>
  );
};

export default FlashcardQuiz;
