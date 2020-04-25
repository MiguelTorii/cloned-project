// @flow
import React, { Fragment } from 'react';
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
    height: 450,
    width: 650,
  },
  button: {
    borderColor: theme.circleIn.palette.primaryText1,
    borderRadius: theme.spacing(1),
    color: theme.circleIn.palette.primaryText1,
    margin: theme.spacing(2),
    padding: '12px 0px',
    width: 150,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
  },
  content: {
    background: theme.circleIn.palette.appBar,
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
  question,
  questionImageUrl
}: Props) => {
  const renderQuestion = () => (
    <Card className={classes.body} key='front'>
      <CardContent className={classes.content}>
        {
          questionImageUrl &&
          <div className={classes.media}>
            <img alt='card media' src={questionImageUrl} style={{ width: '100%' }} />
          </div>
        }
        {question && <div className={classes.text}>{question}</div>}
      </CardContent>
      <CardActions className={classes.actions}>
        <div className={classes.buttons}>
          <Button
            className={classes.button}
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
        {answer && <div className={classes.text}>{answer}</div>}
      </CardContent>
      <CardActions className={classes.actions}>
        <div className={classes.label}>
          Select the difficulty level to view the next card
        </div>
        <div className={classes.buttons}>
          <Button
            className={classes.button}
            onClick={() => onAnswer({ id, answer: 'difficult' })}
            variant="outlined"
          >
            Didn't remember
          </Button>
          <Button
            className={classes.button}
            onClick={() => onAnswer({ id, answer: 'medium' })}
            variant="outlined"
          >
            Almost had it
          </Button>
          <Button
            className={classes.button}
            onClick={() => onAnswer({ id, answer: 'easy' })}
            variant="outlined"
          >
            Correct
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