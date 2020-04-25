// @flow
import React, { useCallback, useEffect, Fragment, useState } from 'react';
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
import type { Flashcard } from 'types/models';
import { logEventLocally } from 'api/analytics';
import FlashcardItem from './Flashcard';

const styles = theme => ({
  button: {
    borderRadius: 8,
    fontWeight: 'bold',
    width: 150,
  },
  content: {
    alignItems: 'center',
    alignSelf: 'center',
    display: 'flex',
    height: '90%',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    display: 'flex',
    fontSize: 16,
    fontWeight: 'bold',
    height: 450,
    justifyContent: 'center',
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
    margin: `${theme.spacing(3)}px 0px`,
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
  }
});

const Transition = React.forwardRef((props, ref) => {
  return <Slide ref={ref} direction="up" {...props} />;
})

type Props = {
  classes: Object,
  flashcards: Array<Flashcard & { id: string }>,
  title: string
};


const FlashcardManager = ({ classes, title, flashcards: orgFlashcards }: Props) => {
  const [open, setOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [sessionId, setSessionId] = useState(null)

  const initialDecks = {
    main: [],
    difficult: [],
    medium: [],
    easy: [],
  }

  const [decks, setDecks] = useState(initialDecks);
  const [currentDeckId, setCurrentDeckId] = useState('main');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDecks({
      ...decks,
      main: shuffle(orgFlashcards)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgFlashcards]);

  const keyboardControl = useCallback(({ keyCode }) => {
    if (keyCode === 32) setFlipped(true);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', keyboardControl);
    return () => {
      window.removeEventListener('keydown', keyboardControl);
    };
  }, [keyboardControl]);

  const resetState = () => {
    setDecks({ ...initialDecks, main: shuffle(orgFlashcards) });
    setCurrentDeckId('main');
  }

  const handleClose = () => {
    if (decks.main.length === 0) {
      setOpen(false);
      resetState();
    } else {
      setConfirmationOpen(true);
    }
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
          variant="contained"
          onClick={() => {
            setOpen(true);
            setSessionId(uuidv4())
          }}
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
            <Button
              className={classes.button}
              color="primary"
              variant="contained"
              onClick={handleClose}
            >
              Done
            </Button>
          </Toolbar>
        </AppBar>
        <div className={classes.content}>
          <div className={classes.scores}>
            <ScoreBox
              deckId="main"
              title="Cards To Review"
              value={decks.main.length}
            />
            <ScoreBox
              deckId="difficult"
              title="Didn't remember"
              value={decks.difficult.length}
            />
            <ScoreBox
              deckId="medium"
              title="Almost had it"
              value={decks.medium.length}
            />
            <ScoreBox
              deckId="easy"
              title="Correct"
              value={decks.easy.length}
            />
          </div>
          {
            currentDeck.length > 0 && currentIndex !== currentDeck.length
              ? <FlashcardItem
                answer={currentDeck[currentIndex].answer}
                answerImageUrl={currentDeck[currentIndex].answerImageUrl}
                id={currentDeck[currentIndex].id}
                isFlipped={flipped}
                onAnswer={handleAnswer}
                onShowAnswer={() => setFlipped(true)}
                question={currentDeck[currentIndex].question}
                questionImageUrl={currentDeck[currentIndex].questionImageUrl}
              />
              : <div className={classes.emptyState}>
                  There aren’t any cards in this stack! <br /><br />
                  Select a different stack on the left side to view more cards.
              </div>
          }
        </div>
      </Dialog>
      <CustomDialog
        okTitle="OK"
        onCancel={() => { setConfirmationOpen(false) }}
        onOk={() => {
          setConfirmationOpen(false);
          setOpen(false);
          resetState();
        }}
        open={confirmationOpen}
        showActions
        showCancel
        title="Warning"
      >
        You haven't completed the deck. Are you sure you want to leave?
      </CustomDialog>
    </Fragment>
  );
}

export default withStyles(styles)(FlashcardManager);
