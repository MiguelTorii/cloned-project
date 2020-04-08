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
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';
// import TextFieldsIcon from '@material-ui/icons/TextFields';
// import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import Dialog from '../Dialog';
import OutlinedTextValidator from '../OutlinedTextValidator';
import DropImage from './DropImage';

const styles = theme => ({
  root: {
    margin: theme.spacing(),
    width: 200,
    height: 200,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.circleIn.palette.primaryText1,
    color: theme.circleIn.palette.normalButtonText1
  },
  icon: {
    color: theme.circleIn.palette.normalButtonText1
  },
  content: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardText: {
    width: '100%',
    height: 60,
    fontWeight: 'bold',
    overflowY: 'auto'
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  inputActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(2)
  },
  extendedIcon: {
    marginRight: theme.spacing()
  },
  divider: {
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(2)
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
  isNew: boolean,
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
    open: false,
    questionImage: false,
    answerImage: false
  };

  constructor(props) {
    super(props);
    // $FlowIgnore
    this.myRef = React.createRef();
  }

  componentDidMount = () => {
    const { isNew, question, answer } = this.props
    if(isNew) this.setState({open: true})
    else {
      this.setState({ question, answer });
    }
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
              <DeleteIcon fontSize="small" className={classes.icon} />
            </IconButton>
          }
          titleTypographyProps={{ color: 'inherit', variant: 'subtitle2' }}
          title={`Flashcard #${index}`}
        />
        <CardContent className={classes.content}>
          <Typography variant="subtitle2" color="inherit" align="center">
            {isQuestion ? 'Question:' : 'Answer:'}
          </Typography>
          <Typography
            variant="subtitle1"
            className={classes.cardText}
            color="inherit"
            align="center"
          >
            {isQuestion ? question : answer}
          </Typography>
        </CardContent>
        <CardActions className={classes.actions}>
          <Button
            disabled={loading}
            onClick={this.handleFlip}
            size="small"
            color="default"
            variant="contained"
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
          title="Flashcard"
          okTitle="Save"
          onCancel={this.handleCancel}
          onOk={this.handleSubmit}
          open={open}
          showActions
          showCancel
        >
          <ValidatorForm onSubmit={this.handleSubmit} ref={this.myRef}>
            <Grid container alignItems="center">
              <Grid item xs={2}>
                <Typography variant="subtitle1">Question</Typography>
              </Grid>
              <Grid container item xs={10}>
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
          </ValidatorForm>
        </Dialog>
      </Fragment>
    );
  }
}

export default withStyles(styles)(FlashcardEditor);
