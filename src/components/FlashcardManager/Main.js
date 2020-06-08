// @flow
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import cx from 'classnames';
import shuffle from 'lodash/shuffle';
import uuidv4 from 'uuid/v4';
import { withRouter } from 'react-router';
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
import FlashcardQuiz from 'components/FlashcardQuiz';
import type { Flashcard } from 'types/models';
import { logEventLocally } from 'api/analytics';
import { updateVisibility as updateVisiblityAction } from 'actions/dialog';
import store from 'store'
import ShareIcon from '@material-ui/icons/Share';
import SharePost from 'containers/SharePost';
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
    alignSelf: 'center',
    display: 'flex',
    height: '100%',
    width: 800,
    justifyContent: 'space-between',
    marginTop: 100,
    position: 'relative',
  },
  dialogPaper: {
    backgroundColor: theme.circleIn.palette.primaryBackground,
  },
  emptyState: {
    alignItems: 'center',
    display: 'flex',
    fontSize: 16,
    fontWeight: 'bold',
    height: 400,
    justifyContent: 'center',
    letterSpacing: 0.6,
    textAlign: 'center',
    width: 600
  },
  root: {
    display: 'flex',
    justifyContent: 'space-between',
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
    marginTop: 0,
  },
  scoreLabel: {
    color: theme.circleIn.palette.action,
  },
  scores: {
    display: 'flex',
    flexDirection: 'column',
  },
  selected: {
    border: '5px solid #7572f7'
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  studyButton: {
    fontSize: 18,
    color: theme.circleIn.palette.primaryText1,
    backgroundColor: theme.circleIn.palette.darkActionBlue,
    fontWeight: 'bold',
    margin: theme.spacing(2, 0),
    marginRight: theme.spacing(),
    padding: theme.spacing(1/2, 5)
  },
  buttonText: {
    marginLeft: theme.spacing()
  }
});

const Transition = React.forwardRef((props, ref) => {
  return <Slide ref={ref} direction="up" {...props} />;
})

type Props = {
  classes: Object,
  flashcards: Array<Flashcard & { id: string }>,
  match: {
    params: {
      flashcardId: string
    }
  },
  postId: number,
  title: string,
  loadData: Function,
  updateVisibility: Function
};

const initialDecks = {
  main: [],
  difficult: [],
  medium: [],
  easy: [],
}

const FlashcardManager = ({
  loadData,
  match : { params: { flashcardId } },
  postId,
  feedId,
  classes,
  title,
  flashcards: orgFlashcards,
  updateVisibility
}: Props) => {
  const [open, setOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [openShare, setOpenShare] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [flipped, setFlipped] = useState(false);
  const [sessionId, setSessionId] = useState(null)
  const [showAnswerClicked, setShowAnswerClicked] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [destinationCenter, setDestinationCenter] = useState(null)

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

  const refScoreHard = useRef(null);
  const refScoreMedium = useRef(null);
  const refScoreEasy = useRef(null);

  const resetState = () => {
    setDecks({ ...initialDecks, main: shuffle(orgFlashcards) });
    setCurrentDeckId('main');
    store.set(`flashcards${postId}`, '')
    setFlipped(false);
  }

  const getRectangleCenter = (rectangle) => {
    return {
      x: rectangle.left + Math.ceil((rectangle.right - rectangle.left) / 2),
      y: rectangle.top + Math.ceil((rectangle.bottom - rectangle.top) / 2),
    }
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
    loadData();
    updateVisibility(false);
  }

  const handleDeckSwitch = (deckId) => {
    setCurrentDeckId(deckId);
    setCurrentIndex(0);
    setFlipped(false);
  }

  const handleAnimationStart = (answer) => {
    let ref;

    if (answer === 'difficult') {
      ref = refScoreHard;
    } else if (answer === 'medium') {
      ref = refScoreMedium;
    } else {
      ref = refScoreEasy;
    }

    setIsAnimating(true);
    setDestinationCenter(getRectangleCenter(ref.current.getBoundingClientRect()))
  }

  const DIFFICULTY = {
    'easy': 1,
    'medium': 5,
    'difficult': 10,
  };

  const handleAnimationEnd = ({ answer, id }) => {
    logEventLocally({
      category: 'Flashcard',
      flashcard_study_session_id: sessionId,
      flashcard_user_selected_difficulty: DIFFICULTY[answer],
      objectId: id,
      type: 'Rated',
    });

    setTimeout(() => {
      setIsAnimating(false);
      setFlipped(false)
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
    }, 100)
  };

  const ScoreBox = React.forwardRef(({ deckId, title, value }, ref) => (
    <div
      className={classes.scoreBox}
      onClick={() => handleDeckSwitch(deckId) }
      onKeyUp={() => handleDeckSwitch(deckId) }
      role='button'
      ref={ref}
      tabIndex='0'
    >
      <div className={cx(classes.score, deckId === currentDeckId ? classes.selected : '')}>
        {value}
      </div>
      <div className={classes.scoreLabel}>{title}</div>
    </div>
  ))

  const currentDeck = decks[currentDeckId];

  const onShare = () => setOpenShare(true)
  const handleCloseShare = () => setOpenShare(false)

  return (
    <>
      <div className={classes.root}>
        <SharePost feedId={feedId} open={openShare} onClose={handleCloseShare} />
        <div style={{ display: 'flex' }}>
          <Tooltip
            id={2287}
            placement="right"
            text="New Study Mode experience is now available!"
          >
            <Button
              color="primary"
              className={classes.studyButton}
              variant="contained"
              onClick={handleOpen}
            >
              Enter Study Mode
            </Button>
          </Tooltip>
          <Button
            color="primary"
            className={classes.studyButton}
            variant="contained"
            onClick={() => setIsQuizOpen(true)}
          >
            Enter Learning Mode
          </Button>
        </div>
        <Button aria-label="Share" onClick={onShare}>
          <ShareIcon />
          <Typography variant="subtitle1" className={classes.buttonText}>
              Share
          </Typography>
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
              ref={refScoreHard}
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
                ref={refScoreMedium}
                title="Almost Had It"
                value={decks.medium.length}
              />
            </Tooltip>
            <ScoreBox
              deckId="easy"
              title="Correct!"
              ref={refScoreEasy}
              value={decks.easy.length}
            />
          </div>
          {
            currentDeck.length > 0 && currentIndex !== currentDeck.length ?
              <FlashcardItem
                answer={currentDeck[currentIndex].answer}
                answerImage={currentDeck[currentIndex].answerImage}
                destinationCenter={destinationCenter}
                id={currentDeck[currentIndex].id}
                isAnimating={isAnimating}
                isFlipped={flipped}
                onAnimationEnd={handleAnimationEnd}
                onAnimationStart={handleAnimationStart}
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
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        fullScreen
        aria-labelledby='quiz-dialog'
        open={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                aria-label="Close"
                color="primary"
                onClick={() => setIsQuizOpen(false)}
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
                className={classes.button}
                color="primary"
                variant="contained"
                onClick={() => setIsQuizOpen(false)}
              >
                Done
              </Button>
            </div>
          </Toolbar>
        </AppBar>
        <div className={classes.content}>
          <FlashcardQuiz flashcardId={flashcardId} isOpen={isQuizOpen} />
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
    </>
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
)(withStyles(styles)(withRouter(FlashcardManager)));
