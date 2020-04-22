// @flow
import React, { useRef, Fragment, useState, useEffect, useCallback } from 'react';
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

const FlashcardEditor = ({
  classes,
  id,
  index,
  question,
  answer,
  loading,
  onDelete,
  onSubmit,
  isNew,
  onDrop,
  onDropRejected
}: Props) => {
  const myRef = useRef(null)
  const [isFlipped, setIsFlipped] = useState(false)
  const [open, setOpen] = useState(false)
  const [curQuestion, setCurQuestion] = useState('')
  const [curAnswer, setCurAnswer] = useState('')

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

  const handleTextChange = useCallback(name => event => {
    if (name === 'question') setCurQuestion(event.target.value)
    else setCurAnswer(event.target.value)
  }, []);

  const handleSubmit = useCallback(async () => {
    if (myRef.current) {
      const result = await myRef.current.isFormValid(false);
      if (result) {
        onSubmit({ id, question: curQuestion, answer: curAnswer });
        handleClose();
      }
    }
  }, [curQuestion, curAnswer, id, handleClose, onSubmit]);

  const handleDrop = useCallback(type => acceptedFiles => {
    onDrop({ id, image: acceptedFiles[0], type });
  }, [id, onDrop]);

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

  return (
    <Fragment>
      <ReactCardFlip isFlipped={isFlipped}>
        {renderContent(true)}
        {renderContent(false)}
      </ReactCardFlip>
      <Dialog
        title="Flashcard"
        okTitle="Save"
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
              <Grid item xs={12}>
                <OutlinedTextValidator
                  onChange={handleTextChange}
                  autoFocus
                  name="question"
                  multiline
                  rows={4}
                  value={curQuestion}
                  fullWidth
                  validators={['required']}
                  errorMessages={['Question is required']}
                />
                {/* <DropImage */}
                {/* isDropzoneDisabled={false} */}
                {/* onDrop={handleDrop('question')} */}
                {/* onDropRejected={onDropRejected} */}
                {/* /> */}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Divider light className={classes.divider} />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle1">Answer</Typography>
            </Grid>
            <Grid container alignItems="center" item xs={10}>
              <Grid item xs={12}>
                <OutlinedTextValidator
                  onChange={handleTextChange}
                  name="answer"
                  multiline
                  rows={4}
                  value={curAnswer}
                  validators={['required']}
                  errorMessages={['Answer is required']}
                />
                {/* <DropImage */}
                {/* isDropzoneDisabled={false} */}
                {/* onDrop={handleDrop('answer')} */}
                {/* onDropRejected={onDropRejected} */}
                {/* /> */}
              </Grid>
            </Grid>
          </Grid>
        </ValidatorForm>
      </Dialog>
    </Fragment>
  );
}

export default React.memo(withStyles(styles)(FlashcardEditor));
