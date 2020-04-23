// @flow
import React, { useMemo, useRef, Fragment, useState, useEffect, useCallback } from 'react';
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
import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';
// import TextFieldsIcon from '@material-ui/icons/TextFields';
// import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import RichTextEditor from 'containers/RichTextEditor';
import withWidth from '@material-ui/core/withWidth';
import clsx from 'clsx'
import Dialog from '../Dialog';

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
  },
  smallRichEditor: {
    '& div': {
      height: 'calc(100% - 62px)'
    },
  },
  bigRichEditor: {
    '& div': {
      height: 'calc(100% - 42px)'
    },
  },
  richEditor: {
    height: 170,
    width: '30vw',
    margin: theme.spacing(1, 0),
    border: `1px solid ${theme.circleIn.palette.borderColor}`,
    borderRadius: theme.spacing(),
    position: 'relative',
    '& .ql-snow .ql-picker.ql-expanded .ql-picker-options': {
      top: 'inherit',
      zIndex: 1,
      bottom: '100%',
    },
    '& div div': {
      height: '100%',
      padding: 0
    },
    '& .ql-image': {
      position: 'absolute',
      right: theme.spacing()
    },
    '& .ql-editor': {
      position: 'absolute',
      width: '100%',
      padding: theme.spacing(),
    },
    '& .ql-toolbar.ql-snow': {
      height: 42,
      zIndex: '1',
      width: '100%',
      border: 'none'
    },
    '& .ql-container.ql-snow': {
      width: '100%',
      border: 'none'
    },
    '& .quill': {
      height: '100%'
    },
    '& .ql-toolbar': {
      position: 'absolute',
      bottom: 0,
      transform: 'translateY(100%)'
    }
  },
  image: {
    position: 'absolute',
    borderRadius: theme.spacing(),
    top: theme.spacing(2),
    left: theme.spacing(),
    maxHeight: 100,
    maxWidth: 100,
    objectFit: 'scale-down',
  },
  imageEditor: {
    '& .ql-editor': {
      width: 'calc(100% - 116px)',
      left: 116,
    }
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
  width: string,
  questionImage: string,
  answerImage: string
};

const FlashcardEditor = ({
  classes,
  id,
  index,
  question,
  answer,
  questionImage,
  answerImage,
  loading,
  onDelete,
  onSubmit,
  isNew,
  width,
}: Props) => {
  const myRef = useRef(null)
  const [isFlipped, setIsFlipped] = useState(false)
  const [open, setOpen] = useState(false)
  const [curQuestion, setCurQuestion] = useState(question)
  const [curAnswer, setCurAnswer] = useState(answer)
  const [curQuestionImage, setCurQuestionImage] = useState(questionImage)
  const [curAnswerImage, setCurAnswerImage] = useState(answerImage)

  useEffect(() => {
    if (isNew) setOpen(true)
  }, [isNew])


  const handleDelete = useCallback(() => {
    onDelete(id);
  }, [onDelete, id]);

  const handleFlip = useCallback(() => {
    setIsFlipped(p => !p)
  }, []);

  const handleOpen = useCallback(() => {
    setOpen(true)
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false)
  }, []);

  const handleCancel = useCallback(() => {
    if (curQuestion === '' || curAnswer === '') {
      onDelete(id);
    } else {
      handleClose();
    }
  }, [id, curQuestion, curAnswer, onDelete, handleClose]);

  const handleTextChange = useCallback(name => v => {
    if (name === 'question') setCurQuestion(v)
    else setCurAnswer(v)
  }, []);

  const handleSubmit = useCallback(async () => {
    if (myRef.current) {
      const result = await myRef.current.isFormValid(false);
      if (result) {
        onSubmit({
          id,
          question: curQuestion,
          answer: curAnswer,
          questionImage: curQuestionImage,
          answerImage: curAnswerImage
        });
        handleClose();
      }
    }
  }, [curQuestionImage, curAnswerImage, curQuestion, curAnswer, id, handleClose, onSubmit]);

  const renderContent = useCallback(isQuestion => {
    return (
      <Card className={classes.root} key={isQuestion ? 'front' : 'back'}>
        <CardHeader
          action={
            <IconButton disabled={loading} onClick={handleDelete}>
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
            onClick={handleFlip}
            size="small"
            color="default"
            variant="contained"
          >
            {isQuestion ? 'View Answer' : 'View Question'}
          </Button>
          <Button
            disabled={loading}
            onClick={handleOpen}
            size="small"
            color="primary"
            variant="contained"
          >
            Edit
          </Button>
        </CardActions>
      </Card>
    );
  }, [classes, question, answer, handleDelete, handleFlip, index, handleOpen, loading]);

  const handleImage = useCallback(name => url => {
    if (name === 'question') setCurQuestionImage(url)
    else setCurAnswerImage(url)
  },[])

  const enabled = useMemo(() => (
    (curQuestion || curQuestionImage) && (curAnswer || curAnswerImage)
  ), [curQuestion, curQuestionImage, curAnswer, curAnswerImage])

  return (
    <Fragment>
      <ReactCardFlip isFlipped={isFlipped}>
        {renderContent(true)}
        {renderContent(false)}
      </ReactCardFlip>
      <Dialog
        title="Create Flashcards"
        okTitle="Save"
        disableOk={!enabled}
        onCancel={handleCancel}
        onOk={handleSubmit}
        open={open}
        showActions
        showCancel
      >
        <ValidatorForm onSubmit={handleSubmit} ref={myRef}>
          <Grid container alignItems="center">
            <Grid item xs={2}>
              <Typography variant="subtitle1">Question</Typography>
            </Grid>
            <Grid container alignItems="center" item xs={10}>
              <Grid
                item
                xs={12}
                className={clsx(
                  classes.richEditor,
                  ['sm', 'xs'].includes(width) ? classes.smallRichEditor : classes.bigRichEditor,
                  curQuestionImage && classes.imageEditor
                )}>
                {curQuestionImage && <img className={classes.image} src={curQuestionImage} alt='questionImage' />}
                <RichTextEditor
                  placeholder=""
                  value={curQuestion}
                  fileType={6}
                  onChange={handleTextChange('question')}
                  handleImage={handleImage('question')}
                />
              </Grid>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle1">Answer</Typography>
            </Grid>
            <Grid container alignItems="center" item xs={10}>
              <Grid
                item
                xs={12}
                className={clsx(
                  classes.richEditor,
                  ['sm', 'xs'].includes(width) ? classes.smallRichEditor : classes.bigRichEditor,
                  curAnswerImage && classes.imageEditor
                )}>
                {curAnswerImage && <img className={classes.image} src={curAnswerImage} alt='answerImage' />}
                <RichTextEditor
                  placeholder=""
                  value={curAnswer}
                  fileType={6}
                  onChange={handleTextChange('answer')}
                  handleImage={handleImage('answer')}
                />
              </Grid>
            </Grid>
          </Grid>
        </ValidatorForm>
      </Dialog>
    </Fragment>
  );
}

export default React.memo(withStyles(styles)(withWidth()(FlashcardEditor)));
