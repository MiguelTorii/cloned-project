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
    marginLeft: theme.spacing(2),
    width: '50%',
    wordBreak: 'break-word',
  },
});

type Props = {
  answer: string,
  answerImageUrl: string,
  classes: Object,
  id: number,
  isFlipped: boolean,
  onAnswer: Function,
  onShowAnswer: Function,
  onShowQuestion: Function,
  question: string,
  questionImageUrl: string
};

const Flashcard = ({
  answer,
  answerImageUrl,
  classes,
  id,
  isFlipped,
  onAnswer,
  onShowAnswer,
  onShowQuestion,
  question,
  questionImageUrl
}: Props) => {
  const createMarkup = (html) => {
    return { __html: sanitizeHtml(html) };
  }

  const renderQuestion = () => (
    <Card className={classes.body} key='front'>
      <CardContent className={classes.content}>
        {
          questionImageUrl &&
          <div className={classes.media}>
            <img alt='card media' src={questionImageUrl} style={{ width: '100%' }} />
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
          answerImageUrl &&
          <div className={classes.media}>
            <img alt='card media' src={answerImageUrl} style={{ width: '100%' }} />
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
          <Button
            className={classes.button}
            color="primary"
            onClick={() => onAnswer({ id, answer: 'difficult' })}
            variant="contained"
          >
            Didn't remember
          </Button>
          <Button
            className={classes.button}
            color="primary"
            onClick={() => onAnswer({ id, answer: 'medium' })}
            variant="contained"
          >
            Almost had it
          </Button>
          <Button
            className={classes.button}
            color="primary"
            onClick={() => onAnswer({ id, answer: 'easy' })}
            variant="contained"
          >
            Correct
          </Button>
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