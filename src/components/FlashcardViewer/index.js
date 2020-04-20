// @flow
import React, { useCallback, useEffect, Fragment, useState } from 'react';
import shuffle from 'lodash/shuffle';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import type { Flashcard } from '../../types/models';
import FlashcardItem from '../Flashcard';

const styles = theme => ({
  root: {
    marginTop: theme.spacing(2)
  },
  appBar: {
    position: 'relative'
  },
  flex: {
    flex: 1
  },
  flashcard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  actions: {
    display: 'flex',
    width: 400,
    justifyContent: 'space-between'
  }
});

const Transition = React.forwardRef((props, ref) => {
  return <Slide ref={ref} direction="up" {...props} />;
})

type Props = {
  classes: Object,
  title: string,
  flashcards: Array<Flashcard & { id: string }>
};


const FlashcardViewer = ({ classes, title, flashcards: orgFlashcards}: Props) => {
  const [open, setOpen] = useState(false)
  const [flipped, setFlipped] = useState(false)
  const [flashcards, setFlashcards] = useState([])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    setFlashcards(shuffle(orgFlashcards))
  }, [orgFlashcards])

  const handleClickOpen = useCallback(() => {
    setOpen(true)
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false)
  },[]);

  const handleShuffle = useCallback(() => {
    setFlashcards(shuffle(orgFlashcards))
    setCurrent(0)
  }, [orgFlashcards]);

  const handlePrevious = useCallback(() => {
    if (current > 0) setCurrent(c=> (c-1))
  }, [current]);

  const handleNext = useCallback(() => {
    if (current < flashcards.length - 1) setCurrent(c=> c+1)
  }, [flashcards, current]);

  const handleFlip = useCallback(() => setFlipped(p => !p), [])

  const keyboardControl = useCallback(({ key, keyCode }) => {
    if (keyCode === 32) handleFlip()
    if (key === 'ArrowRight') handleNext()
    if (key ==='ArrowLeft') handlePrevious()
  }, [handleNext, handlePrevious, handleFlip])

  useEffect(() => {
    window.addEventListener('keydown', keyboardControl);
    return () => {
      window.removeEventListener('keydown', keyboardControl);
    };
  }, [keyboardControl]);

  return (
    <Fragment>
      <div className={classes.root}>
        <Button
          color="primary"
          variant="contained"
          onClick={handleClickOpen}
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
          <Toolbar>
            <IconButton
              color="primary"
              onClick={handleClose}
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
            <Typography
              variant="h6"
              color="textPrimary"
              className={classes.flex}
            >
              {`${title} (${flashcards.length})`}
            </Typography>
            <Button
              color="primary"
              variant="contained"
              onClick={handleShuffle}
            >
                Shuffle
            </Button>
          </Toolbar>
        </AppBar>
        <div className={classes.flashcard}>
          {flashcards && flashcards.length > 0 && (
            <FlashcardItem
              isFlipped={flipped}
              index={
                orgFlashcards.findIndex(
                  o => o.id === flashcards[current].id
                ) + 1
              }
              question={flashcards[current].question}
              answer={flashcards[current].answer}
              studyMode
            />
          )}
          <div className={classes.actions}>
            <Button
              disabled={current === 0}
              color="primary"
              variant="contained"
              onClick={handlePrevious}
            >
                Previous
            </Button>
            <Button
              disabled={current === flashcards.length - 1}
              color="primary"
              variant="contained"
              onClick={handleNext}
            >
                Next
            </Button>
          </div>
        </div>
      </Dialog>
    </Fragment>
  );
}

export default withStyles(styles)(FlashcardViewer);
