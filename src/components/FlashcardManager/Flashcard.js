/* eslint-disable react/no-danger */
// @flow
import React, { useRef, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import sanitizeHtml from 'sanitize-html';
import ReactCardFlip from 'react-card-flip';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import CustomQuill from 'components/CustomQuill'

const styles = theme => ({
  actions: {
    display: 'block',
  },
  body: {
    height: 400,
    overflow: 'visible',
    position: 'relative',
    width: 600,
  },
  button: {
    borderRadius: theme.spacing(1),
    fontWeight: 'bold',
    letterSpacing: 0.6,
    margin: `0px ${theme.spacing(2)}px`,
    padding: '12px 0px',
    width: 150,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    margin: "16px 0px",
  },
  content: {
    background: theme.circleIn.palette.rowSelection,
    display: 'flex',
    height: '100%',
    padding: theme.spacing(3),
    justifyContent: 'center',
    width: '100%',
  },
  image: {
    height: '100%',
    objectFit: 'contain',
    width: '100%',
  },
  label: {
    textAlign: 'center',
  },
  media: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    width: '50%'
  },
  text: {
    alignItems: 'center',
    display: 'flex',
    fontSize: 16,
    fontWeight: 'bold',
    justifyContent: 'center',
    margin: theme.spacing(2),
    padding: '0px 4px',
    overflow: 'auto',
    width: '50%',
    wordBreak: 'break-word',
  },
  tooltip: {
    background: theme.circleIn.palette.appBar,
  },
  tooltipLabel: {
    fontSize: 14,
    letterSpacing: 0.6,
    lineHeight: 1.2,
  },
  tooltipArrow: {
    color: theme.circleIn.palette.appBar,
    fontSize: 12,
  }
});

type Props = {
  answer: string,
  answerImage: string,
  classes: Object,
  id: number,
  isAnimating: boolean,
  isFlipped: boolean,
  onAnimationStart: Function,
  onAnimationEnd: Function,
  onShowAnswer: Function,
  onShowQuestion: Function,
  question: string,
  questionImage: string
};

const Flashcard = ({
  answer,
  answerImage,
  classes,
  id,
  destinationCenter,
  isAnimating,
  isFlipped,
  onAnimationEnd,
  onAnimationStart,
  onShowAnswer,
  onShowQuestion,
  question,
  questionImage,
}: Props) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [animationEnded, setAnimationEnded] = useState(false);
  const refCard = useRef(null);

  const createMarkup = (html) => {
    return { __html: sanitizeHtml(html) };
  }

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const prevIsAnimating = usePrevious({ isAnimating });

  useEffect(() => {
    if (prevIsAnimating && prevIsAnimating.isAnimating && !isAnimating) {
      setAnimationEnded(true);
    } else {
      setAnimationEnded(false);
    }
  }, [prevIsAnimating, isAnimating])

  const animatedBoxKeyframes = ({ x, y }) => {
    return keyframes`
      0% {
        transform: translate(0px, 0px) scale(1);
      }
      100% {
        transform: translate(${x}px, ${y}px) scale(0);
      }
    `
  };

  const AnimatedBox = styled.div`
    display: inline-block;
    animation-name: ${(props) => animatedBoxKeyframes(props)};
    animation-duration: 0.6s;
    animation-timing-function: ease;
    animation-delay: 0s;
    position: absolute;
    animation-iteration-count: 1;
    animation-direction: normal;
    animation-fill-mode: forwards;
    width: 100%;
    height: 100%;
    transform-origin: 50% 50%;
  `;

  const getRectangleCenter = (rectangle) => {
    return {
      x: rectangle.left + ((rectangle.right - rectangle.left) / 2),
      y: rectangle.top + ((rectangle.bottom - rectangle.top) / 2),
    }
  };

  const calculateOffset = () => {
    const sourceCenter = getRectangleCenter(refCard.current.getBoundingClientRect());

    return {
      x: Math.ceil(destinationCenter.x - sourceCenter.x),
      y: Math.ceil(destinationCenter.y - sourceCenter.y)
    }
  };

  const handleAnimationEnd = () => {
    onAnimationEnd({ id, answer: selectedAnswer });
  };

  const handleAnswer = (answerId) => {
    setSelectedAnswer(answerId);
    onAnimationStart(answerId);
  };

  const Animation = ({ children }) => {
    if (!isAnimating) return children;

    const { x, y } = calculateOffset();

    return (<AnimatedBox onAnimationEnd={handleAnimationEnd} x={x} y={y}>{children}</AnimatedBox>);
  };

  const renderAnswer = () => (
    <Card ref={refCard} className={classes.body} key='back'>
      <Animation>
        <CardContent className={classes.content}>
          {
            answerImage &&
            <div className={classes.media}>
              <img alt='card media' src={answerImage} className={classes.image} />
            </div>
          }
          {
            answer &&
              <div className={classes.text}>
                <CustomQuill value={answer} readOnly />
              </div>
          }
        </CardContent>
      </Animation>
    </Card>
  );

  const renderQuestion = () => (
    <Card className={classes.body} key='front'>
      <CardContent className={classes.content}>
        {
          questionImage &&
          <div className={classes.media}>
            <img alt='card media' src={questionImage} className={classes.image} />
          </div>
        }
        {
          question &&
              <div className={classes.text}>
                <CustomQuill value={question} readOnly />
              </div>
        }
      </CardContent>
    </Card>
  );

  return (
    <div>
      {
        // When the animation ends re-initialize the flipper instead of showing the flipping effect.
        animationEnded ? null :
          <ReactCardFlip isFlipped={isFlipped}>
            {renderQuestion()}
            {renderAnswer()}
          </ReactCardFlip>
      }
      {
        !isFlipped ?
          <CardActions className={classes.actions}>
            <div className={classes.buttons}>
              <Button
                className={classes.button}
                color="primary"
                onClick={() => onShowAnswer(true)}
                variant="outlined"
              >
                Show Answer
              </Button>
            </div>
          </CardActions> :
          <CardActions className={classes.actions}>
            <div className={classes.label}>
              Select the difficulty level to view the next card
            </div>
            <div className={classes.buttons}>
              <Tooltip
                arrow
                classes={{
                  arrow: classes.tooltipArrow,
                  tooltip: classes.tooltip,
                }}
                enterDelay={700}
                placement='top'
                title={
                  <p className={classes.tooltipLabel}>
                    Select <b>Didn't Remember</b> if you weren't able to remember the answer
                  </p>
                }
              >
                <Button
                  className={classes.button}
                  color="primary"
                  onClick={() => handleAnswer('difficult')}
                  variant="contained"
                >
                  Didn't Remember
                </Button>
              </Tooltip>
              <Tooltip
                arrow
                classes={{
                  arrow: classes.tooltipArrow,
                  tooltip: classes.tooltip,
                }}
                enterDelay={700}
                placement='top'
                title={
                  <p className={classes.tooltipLabel}>
                    Select <b>Almost Had It</b> if you were close to answering the correct answer or had difficulty answering it
                  </p>
                }
              >
                <Button
                  className={classes.button}
                  color="primary"
                  onClick={() => handleAnswer('medium')}
                  variant="contained"
                >
                  Almost Had It
                </Button>
              </Tooltip>
              <Tooltip
                arrow
                classes={{
                  arrow: classes.tooltipArrow,
                  tooltip: classes.tooltip,
                }}
                enterDelay={700}
                placement='top'
                title={
                  <p className={classes.tooltipLabel}>
                    Select <b>Correct!</b> if you answered the question correctly
                  </p>
                }
              >
                <Button
                  className={classes.button}
                  color="primary"
                  onClick={() => handleAnswer('easy')}
                  variant="contained"
                >
                  Correct!
                </Button>
              </Tooltip>
            </div>
            <div className={classes.buttons}>
              <Button
                className={classes.button}
                color="primary"
                onClick={() => onShowQuestion()}
                variant="outlined"
              >
                Show Question
              </Button>
            </div>
          </CardActions>
      }
    </div>
  );
}

export default withStyles(styles)(Flashcard);
