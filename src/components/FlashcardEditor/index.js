// @flow
import React, { Fragment } from 'react';
import ReactCardFlip from 'react-card-flip';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
// import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';
// import TextFieldsIcon from '@material-ui/icons/TextFields';
// import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import OutlinedTextValidator from '../OutlinedTextValidator';
import DropImage from './DropImage';

const styles = theme => ({
  root: {
    margin: theme.spacing.unit,
    width: 200,
    height: 200,
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  cardText: {
    width: '100%',
    height: 60,
    overflowY: 'auto'
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  inputActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: theme.spacing.unit * 2
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  },
  divider: {
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2
  }
});

type Props = {
  classes: Object,
  id: string,
  index: number,
  question: string,
  answer: string,
  loading: boolean,
  onDelete: Function,
  onSubmit: Function,
  onDrop: Function,
  onDropRejected: Function
};

type State = {
  question: string,
  answer: string,
  isFlipped: boolean,
  open: boolean,
  questionImage: boolean,
  answerImage: boolean
};

class FlashcardEditor extends React.PureComponent<Props, State> {
  state = {
    question: '',
    answer: '',
    isFlipped: false,
    open: true,
    questionImage: false,
    answerImage: false
  };

  constructor(props) {
    super(props);
    // $FlowIgnore
    this.myRef = React.createRef();
  }

  componentDidUpdate = prevProps => {
    const { question, answer } = this.props;
    const { open } = this.state;
    if (
      !open &&
      (question !== prevProps.question || answer !== prevProps.answer)
    ) {
      this.setState({ question, answer });
    }
  };

  handleDelete = () => {
    const { id, onDelete } = this.props;
    onDelete(id);
  };

  handleFlip = () => {
    this.setState(({ isFlipped }) => ({ isFlipped: !isFlipped }));
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleCancel = () => {
    const { id, question, answer, onDelete } = this.props;
    if (question === '' || answer === '') {
      onDelete(id);
    } else {
      this.setState({ question, answer });
      this.handleClose();
    }
  };

  handleTextChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleSubmit = async () => {
    if (this.myRef && this.myRef.current) {
      const result = await this.myRef.current.isFormValid(false);
      if (result) {
        const { id, onSubmit } = this.props;
        const { question, answer } = this.state;
        onSubmit({ id, question, answer });
        this.handleClose();
      }
    }
  };

  handleInputType = name => () => {
    this.setState(prevState => ({ [name]: !prevState[name] }));
  };

  handleDrop = type => acceptedFiles => {
    const { id, onDrop } = this.props;
    onDrop({ id, image: acceptedFiles[0], type });
  };

  renderContent = isQuestion => {
    const { classes, index, question, answer, loading } = this.props;
    return (
      <Card className={classes.root} key={isQuestion ? 'front' : 'back'}>
        <CardHeader
          action={
            <IconButton disabled={loading} onClick={this.handleDelete}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          }
          title={`Flashcard #${index}`}
        />
        <CardContent className={classes.content}>
          <Typography variant="subtitle1">
            {isQuestion ? 'Question:' : 'Answer:'}
          </Typography>
          <Typography className={classes.cardText}>
            {isQuestion ? question : answer}
          </Typography>
        </CardContent>
        <CardActions className={classes.actions}>
          <Button
            disabled={loading}
            onClick={this.handleFlip}
            size="small"
            color="default"
            variant="outlined"
          >
            {isQuestion ? 'View Answer' : 'View Question'}
          </Button>
          <Button
            disabled={loading}
            onClick={this.handleOpen}
            size="small"
            color="primary"
            variant="contained"
          >
            Edit
          </Button>
        </CardActions>
      </Card>
    );
  };

  myRef: Object;

  render() {
    const { classes, onDropRejected } = this.props;
    const {
      question,
      answer,
      isFlipped,
      open,
      questionImage,
      answerImage
    } = this.state;

    return (
      <Fragment>
        <ReactCardFlip isFlipped={isFlipped}>
          {this.renderContent(true)}
          {this.renderContent(false)}
        </ReactCardFlip>
        <Dialog
          open={open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <ValidatorForm onSubmit={this.handleSubmit} ref={this.myRef}>
            <DialogTitle id="form-dialog-title">Flashcard</DialogTitle>
            <DialogContent>
              <Grid container alignItems="center">
                <Grid item xs={2}>
                  <Typography variant="subtitle1">Question</Typography>
                </Grid>
                <Grid container item xs={10}>
                  {/* <Grid item xs={12} className={classes.inputActions}>
                    <Fab
                      variant="extended"
                      color="primary"
                      size="small"
                      aria-label="Change Type"
                      onClick={this.handleInputType('questionImage')}
                    >
                      {!questionImage ? (
                        <Fragment>
                          <InsertPhotoIcon className={classes.extendedIcon} />
                          Insert Image
                        </Fragment>
                      ) : (
                        <Fragment>
                          <TextFieldsIcon className={classes.extendedIcon} />
                          Insert Text
                        </Fragment>
                      )}
                    </Fab>
                  </Grid> */}
                  <Grid item xs={12}>
                    {!questionImage ? (
                      <OutlinedTextValidator
                        label="Question"
                        onChange={this.handleTextChange}
                        autoFocus
                        name="question"
                        multiline
                        rows={4}
                        value={question}
                        fullWidth
                        validators={['required']}
                        errorMessages={['Question is required']}
                      />
                    ) : (
                      <DropImage
                        isDropzoneDisabled={false}
                        onDrop={this.handleDrop('question')}
                        onDropRejected={onDropRejected}
                      />
                    )}
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Divider light className={classes.divider} />
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="subtitle1">Answer</Typography>
                </Grid>
                <Grid container item xs={10}>
                  {/* <Grid item xs={12} className={classes.inputActions}>
                    <Fab
                      variant="extended"
                      color="primary"
                      size="small"
                      aria-label="Change Type"
                      onClick={this.handleInputType('answerImage')}
                    >
                      {!answerImage ? (
                        <Fragment>
                          <InsertPhotoIcon className={classes.extendedIcon} />
                          Insert Image
                        </Fragment>
                      ) : (
                        <Fragment>
                          <TextFieldsIcon className={classes.extendedIcon} />
                          Insert Text
                        </Fragment>
                      )}
                    </Fab>
                  </Grid> */}
                  <Grid item xs={12}>
                    {!answerImage ? (
                      <OutlinedTextValidator
                        label="Answer"
                        onChange={this.handleTextChange}
                        name="answer"
                        multiline
                        rows={4}
                        value={answer}
                        validators={['required']}
                        errorMessages={['Answer is required']}
                      />
                    ) : (
                      <DropImage
                        isDropzoneDisabled={false}
                        onDrop={this.handleDrop('answer')}
                        onDropRejected={onDropRejected}
                      />
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.handleSubmit}
                variant="outlined"
                color="primary"
              >
                Save
              </Button>
              <Button onClick={this.handleCancel} color="primary">
                Close
              </Button>
            </DialogActions>
          </ValidatorForm>
        </Dialog>
      </Fragment>
    );
  }
}

export default withStyles(styles)(FlashcardEditor);
