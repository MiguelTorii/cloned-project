// @flow
import React, { useCallback, useEffect, Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import cx from 'classnames';
import shuffle from 'lodash/shuffle';
import uuidv4 from 'uuid/v4';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import CustomDialog from 'components/Dialog';
import Tooltip from 'containers/Tooltip';
import type { Flashcard } from 'types/models';
import { logEventLocally } from 'api/analytics';
import { updateVisibility as updateVisiblityAction } from 'actions/dialog';
import store from 'store'
import FlashcardItem from './Flashcard';

const styles = theme => ({
  buttonReset: {
    marginRight: theme.spacing(),
    borderRadius: 8,
    fontWeight: 'bold',
    letterSpacing: 0.6,
    width: 150,
  },
  button: {
    borderRadius: 8,
    fontWeight: 'bold',
    letterSpacing: 0.6,
    width: 150,
  },
  content: {
    alignItems: 'center',
    alignSelf: 'center',
    display: 'flex',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyState: {
    alignItems: 'center',
    display: 'flex',
    fontSize: 16,
    fontWeight: 'bold',
    height: 500,
    justifyContent: 'center',
    letterSpacing: 0.6,
    textAlign: 'center',
    width: 650,
  },
  score: {
    alignItems: 'center',
    background: '#ffffff',
    color: 'black',
    cursor: 'pointer',
    display: 'flex',
    fontSize: theme.spacing(3),
    fontWeight: 'bold',
    height: 75,
    justifyContent: 'center',
    marginBottom: theme.spacing(1),
    width: 75,
  },
  scoreBox: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    margin: `${theme.spacing(2)}px 0px`,
  },
  scoreLabel: {
    color: theme.circleIn.palette.action,
  },
  scores: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: theme.spacing(10),
  },
  selected: {
    border: '5px solid #7572f7'
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  studyButton: {
    margin: theme.spacing(2, 0)
  }
});

const Transition = React.forwardRef((props, ref) => {
  return <Slide ref={ref} direction="up" {...props} />;
})

type Props = {
  classes: Object,
  flashcards: Array<Flashcard & { id: string }>,
  postId: number,
  title: string,
  updateVisibility: Function
};

const initialDecks = {
  main: [],
  difficult: [],
  medium: [],
  easy: [],
}

const FlashcardManager = ({
  postId, classes, title, flashcards: orgFlashcards, updateVisibility }: Props) => {
  const [open, setOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false)
  const [flipped, setFlipped] = useState(false);
  const [sessionId, setSessionId] = useState(null)
  const [showAnswerClicked, setShowAnswerClicked] = useState(false)

  const [decks, setDecks] = useState(initialDecks);
  const [currentDeckId, setCurrentDeckId] = useState('main');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const stored = store.get(`flashcards${postId}`)
    const previousDecks = stored && JSON.parse(stored)
    const current = {
      main: [],
      difficult: [],
      medium: [],
      easy: [],
    }

    orgFlashcards.forEach(card => {
      const deck = previousDecks ? previousDecks[String(card.id)] : 'main'
      if (deck) current[deck] = [...current[deck] , card]
      else current.main = [...current.main, card]
    })

    setDecks(current)
  }, [orgFlashcards, postId]);

  const keyboardControl = useCallback(({ keyCode }) => {
    if (keyCode === 32) setFlipped(!flipped);
  }, [flipped]);

  useEffect(() => {
    window.addEventListener('keydown', keyboardControl);
    return () => {
      window.removeEventListener('keydown', keyboardControl);
    };
  }, [keyboardControl]);

  const resetState = () => {
    setDecks({ ...initialDecks, main: shuffle(orgFlashcards) });
    setCurrentDeckId('main');
    store.set(`flashcards${postId}`, '')
    setFlipped(false);
  }

  useEffect (() => {
    const saveDeck = () => {
      const current = {}
      decks.main.forEach(d => {current[d.id] = 'main'})
      decks.difficult.forEach(d => {current[d.id] = 'difficult'})
      decks.medium.forEach(d => {current[d.id] = 'medium' })
      decks.easy.forEach(d =>  {current[d.id] = 'easy' })
      store.set(`flashcards${postId}`, JSON.stringify(current))
    }
    saveDeck()
  }, [decks, postId])

  const handleOpen = () => {
    setOpen(true);
    setSessionId(uuidv4());
    updateVisibility(true);
  }

  const handleClose = () => {
    setOpen(false);
    updateVisibility(false);
  }

  const handleDeckSwitch = (deckId) => {
    setCurrentDeckId(deckId);
    setCurrentIndex(0);
    setFlipped(false);
  }

  const DIFFICULTY = {
    'easy': 1,
    'medium': 5,
    'difficult': 10,
  };

  const handleAnswer = ({ answer, id }) => {
    setFlipped(false);

    logEventLocally({
      category: 'Flashcard',
      flashcard_study_session_id: sessionId,
      flashcard_user_selected_difficulty: DIFFICULTY[answer],
      objectId: id,
      type: 'Rated',
    });

    setTimeout(() => {
      if (currentDeckId === 'main') {
        setDecks({
          ...decks,
          [answer]: decks[answer].concat(decks.main.shift(0))
        })
      } else if (currentDeckId !== answer) {
        setDecks({
          ...decks,
          [answer]: decks[answer].concat(decks[currentDeckId].splice(currentIndex, 1)),
        });
      } else if (decks[currentDeckId][currentIndex + 1]) {
        setCurrentIndex(currentIndex + 1);
      }
    }, 200);
  };

  const ScoreBox = ({ deckId, title, value }) => (
    <div
      className={classes.scoreBox}
      onClick={() => handleDeckSwitch(deckId) }
      onKeyUp={() => handleDeckSwitch(deckId) }
      role='button'
      tabIndex='0'
    >
      <div className={cx(classes.score, deckId === currentDeckId ? classes.selected : '')}>
        {value}
      </div>
      <div className={classes.scoreLabel}>{title}</div>
    </div>
  )

  const currentDeck = decks[currentDeckId];

  return (
    <Fragment>
      <div className={classes.root}>
        <Button
          color="primary"
          className={classes.studyButton}
          variant="contained"
          onClick={handleOpen}
        >
          Study Now
        </Button>
      </div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                aria-label="Close"
                color="primary"
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
              <Typography
                color="textPrimary"
                variant="h6"
              >
                {title}
              </Typography>
            </div>
            <div>
              <Button
                className={classes.buttonReset}
                color="primary"
                variant="contained"
                onClick={() => setResetOpen(true)}
              >
                  Start Over
              </Button>
              <Button
                className={classes.button}
                color="primary"
                variant="contained"
                onClick={handleClose}
              >
              Done
              </Button>
            </div>
          </Toolbar>
        </AppBar>
        <div className={classes.content}>
          <div className={classes.scores}>
            <Tooltip
              id={5436}
              placement="right"
              text="Here's the total number of flashcards that need to be reviewed in this stack."
            >
              <ScoreBox
                deckId="main"
                title="Cards To Review"
                value={decks.main.length}
              />
            </Tooltip>
            <ScoreBox
              deckId="difficult"
              title="Didn't Remember"
              value={decks.difficult.length}
            />
            <Tooltip
              delay={1000}
              hidden={!showAnswerClicked}
              id={4212}
              placement="right"
              text="After you select the difficulty of the card, it gets moved into one of the three stacks.
              Now you have the power to review what's most important for you to know."
            >
              <ScoreBox
                deckId="medium"
                title="Almost Had It"
                value={decks.medium.length}
              />
            </Tooltip>
            <ScoreBox
              deckId="easy"
              title="Correct!"
              value={decks.easy.length}
            />
          </div>
          {
            currentDeck.length > 0 && currentIndex !== currentDeck.length
              ? <FlashcardItem
                answer={currentDeck[currentIndex].answer}
                answerImage={currentDeck[currentIndex].answerImage}
                id={currentDeck[currentIndex].id}
                isFlipped={flipped}
                onAnswer={handleAnswer}
                onShowAnswer={() => {
                  setFlipped(true);
                  setShowAnswerClicked(true);
                }}
                onShowQuestion={() => setFlipped(false)}
                question={currentDeck[currentIndex].question}
                questionImage={currentDeck[currentIndex].questionImage}
              />
              : <div className={classes.emptyState}>
                  You don't have any cards in this stack! <br /><br />
                  Click a different stack on the left side to view more cards.
              </div>
          }
        </div>
      </Dialog>
      <CustomDialog
        okTitle="Yes"
        onCancel={() => { setResetOpen(false) }}
        onOk={() => {
          setResetOpen(false);
          resetState();
        }}
        open={resetOpen}
        showActions
        showCancel
        title="Start Over"
      >
          If you Start Over, then you'll reset your progress. Are you sure you want to restart?
      </CustomDialog>
    </Fragment>
  );
}

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      updateVisibility: updateVisiblityAction
    },
    dispatch
  );

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(FlashcardManager));
