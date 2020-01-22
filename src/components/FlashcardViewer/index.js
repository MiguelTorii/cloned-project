// @flow
import React, { Fragment } from 'react';
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

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

type Props = {
  classes: Object,
  title: string,
  flashcards: Array<Flashcard & { id: string }>
};

type State = {
  open: boolean,
  flashcards: Array<Flashcard & { id: string }>,
  current: number
};

class FlashcardViewer extends React.PureComponent<Props, State> {
  state = {
    open: false,
    flashcards: [],
    current: 0
  };

  componentDidMount = () => {
    const { flashcards } = this.props;
    this.setState({ flashcards: shuffle(flashcards) });
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleShuffle = () => {
    const { flashcards } = this.props;
    this.setState({ flashcards: shuffle(flashcards), current: 0 });
  };

  handlePrevious = () => {
    this.setState(({ current }) => ({ current: current - 1 }));
  };

  handleNext = () => {
    this.setState(({ current }) => ({ current: current + 1 }));
  };

  render() {
    const { classes, title, flashcards: orgFlashcards } = this.props;
    const { open, flashcards, current } = this.state;

    return (
      <Fragment>
        <div className={classes.root}>
          <Button
            color="primary"
            variant="contained"
            onClick={this.handleClickOpen}
          >
            Study Now
          </Button>
        </div>
        <Dialog
          fullScreen
          open={open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="primary"
                onClick={this.handleClose}
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
                onClick={this.handleShuffle}
              >
                Shuffle
              </Button>
            </Toolbar>
          </AppBar>
          <div className={classes.flashcard}>
            {flashcards && flashcards.length > 0 && (
              <FlashcardItem
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
                onClick={this.handlePrevious}
              >
                Previous
              </Button>
              <Button
                disabled={current === flashcards.length - 1}
                color="primary"
                variant="contained"
                onClick={this.handleNext}
              >
                Next
              </Button>
            </div>
          </div>
        </Dialog>
      </Fragment>
    );
  }
}

export default withStyles(styles)(FlashcardViewer);
