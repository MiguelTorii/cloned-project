/* eslint-disable react/no-danger */
// @flow
import React, { Fragment } from 'react';
import sanitizeHtml from 'sanitize-html';
import ReactCardFlip from 'react-card-flip';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
  actions: {
    display: 'block'
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    height: 500,
    width: 650,
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
    padding: theme.spacing(4),
    height: '100%',
    justifyContent: 'center',
    overflow: 'auto',
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
  isFlipped: boolean,
  onAnswer: Function,
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
  isFlipped,
  onAnswer,
  onShowAnswer,
  onShowQuestion,
  question,
  questionImage
}: Props) => {
  const createMarkup = (html) => {
    return { __html: sanitizeHtml(html) };
  }

  const renderQuestion = () => (
    <Card className={classes.body} key='front'>
      <CardContent className={classes.content}>
        {
          questionImage &&
          <div className={classes.media}>
            <img alt='card media' src={questionImage} style={{ width: '100%' }} />
          </div>
        }
        {
          question &&
          <div
            className={classes.text}
            dangerouslySetInnerHTML={createMarkup(question)}
          />
        }
      </CardContent>
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
      </CardActions>
    </Card>
  );

  const renderAnswer = () => (
    <Card className={classes.body} key='back'>
      <CardContent className={classes.content}>
        {
          answerImage &&
          <div className={classes.media}>
            <img alt='card media' src={answerImage} style={{ width: '100%' }} />
          </div>
        }
        {
          answer &&
          <div
            className={classes.text}
            dangerouslySetInnerHTML={createMarkup(answer)}
          />
        }
      </CardContent>
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
              onClick={() => onAnswer({ id, answer: 'difficult' })}
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
              onClick={() => onAnswer({ id, answer: 'medium' })}
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
              onClick={() => onAnswer({ id, answer: 'easy' })}
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
    </Card>
  );

  return (
    <Fragment>
      <ReactCardFlip isFlipped={isFlipped}>
        {renderQuestion()}
        {renderAnswer()}
      </ReactCardFlip>
    </Fragment>
  );
}

export default withStyles(styles)(Flashcard)