// @flow

import React, { useMemo, useRef, Fragment, useState, useEffect, useCallback } from 'react';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { withStyles } from '@material-ui/core/styles';
// import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
// import TextFieldsIcon from '@material-ui/icons/TextFields';
// import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import RichTextEditor from 'containers/RichTextEditor/RichTextEditor';
import withWidth from '@material-ui/core/withWidth';
import clsx from 'clsx';
import SelectedImage from 'components/SelectedImage/SelectedImage';
import FlashcardDetail from 'components/FlashcardDetail/FlashcardList';
import ToolbarTooltip from 'components/FlashcardEditor/ToolbarTooltip';
import Dialog from '../Dialog/Dialog';

import { styles } from '../_styles/FlashcardEditor/index';

const strip = (s) => s.replace(/<[^>]*>?/gm, '').trim();

type Props = {
  classes: Object,
  id: string,
  question: string,
  answer: string,
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
  question,
  answer,
  questionImage,
  answerImage,
  onDelete,
  onSubmit,
  isNew,
  width
}: Props) => {
  const myRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [curQuestion, setCurQuestion] = useState(question);
  const [curAnswer, setCurAnswer] = useState(answer);
  const [curQuestionImage, setCurQuestionImage] = useState(questionImage);
  const [curAnswerImage, setCurAnswerImage] = useState(answerImage);
  const [loadingImage, setLoadingImage] = useState(false);
  const [focus, setFocus] = useState('question');

  useEffect(() => {
    if (isNew) {
      setOpen(true);
    }
  }, [isNew]);

  const handleDelete = useCallback(() => {
    onDelete(id);
  }, [onDelete, id]);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleCancel = useCallback(() => {
    if (strip(question) === '' || strip(answer) === '') {
      onDelete(id);
    } else {
      setCurQuestion(question);
      setCurAnswer(answer);
      setCurQuestionImage(questionImage);
      setCurAnswerImage(answerImage);
      handleClose();
    }
  }, [id, onDelete, handleClose, question, answer, questionImage, answerImage]);

  const handleTextChange = useCallback(
    (name) => (v) => {
      if (name === 'question') {
        setCurQuestion(v.replace('\t', ''));
      } else {
        setCurAnswer(v.replace('\t', ''));
      }
    },
    []
  );

  const handleDone = useCallback(() => {
    if (
      (strip(curQuestion) === '' && !curQuestionImage) ||
      (strip(curAnswer) === '' && !curAnswerImage)
    ) {
      onDelete(id);
    } else {
      onSubmit({
        id,
        question: curQuestion,
        answer: curAnswer,
        questionImage: curQuestionImage,
        answerImage: curAnswerImage,
        end: true
      });
    }
    handleClose();
  }, [
    curQuestionImage,
    curAnswerImage,
    curQuestion,
    curAnswer,
    id,
    handleClose,
    onSubmit,
    onDelete
  ]);

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

  const handleImage = useCallback(
    (name) => (url) => {
      if (name === 'question') {
        setCurQuestionImage(url);
      } else {
        setCurAnswerImage(url);
      }
    },
    []
  );

  const enabled = useMemo(
    () => (strip(curQuestion) || curQuestionImage) && (strip(curAnswer) || curAnswerImage),
    [curQuestion, curQuestionImage, curAnswer, curAnswerImage]
  );

  const imageStyle = useMemo(
    () => ({
      borderRadius: 8,
      maxHeight: 100,
      maxWidth: 100
    }),
    []
  );

  const deleteQuestionImage = useCallback(() => setCurQuestionImage(null), []);
  const deleteAnswerImage = useCallback(() => setCurAnswerImage(null), []);

  const onFocusQuestion = useCallback(() => setFocus('question'), []);
  const onFocusAnswer = useCallback(() => setFocus('answer'), []);
  const [questionEditor, setQuestionEditor] = useState(null);
  const [answerEditor, setAnswerEditor] = useState(null);
  const [questionToolbar, setQuestionToolbar] = useState(null);
  const [answerToolbar, setAnswerToolbar] = useState(null);
  const [okRef, setOkRef] = useState(null);

  useEffect(() => {
    if (questionEditor) {
      try {
        setQuestionToolbar(questionEditor.getEditor().theme.modules.toolbar);
        questionEditor.getEditor().root.onfocus = () => {
          onFocusQuestion();
        };
        questionEditor.getEditor().root.onkeydown = (k) => {
          if (k.code === 'Tab' && answerEditor) {
            k.preventDefault();
            k.stopPropagation();
            answerEditor.focus();
          }
        };
        setTimeout(() => {
          if (questionEditor) {
            questionEditor.focus();
          }
        }, 100);
      } catch (e) {}
    }
  }, [questionEditor, onFocusQuestion, answerEditor]);

  useEffect(() => {
    if (answerEditor) {
      try {
        setAnswerToolbar(answerEditor.getEditor().theme.modules.toolbar);
        answerEditor.getEditor().root.onkeydown = (k) => {
          if (k.code === 'Tab') {
            k.preventDefault();
            k.stopPropagation();
            if (okRef && okRef.disabled) {
              questionEditor.focus();
            } else {
              okRef.focus();
            }
          }
        };
        answerEditor.getEditor().root.onfocus = () => {
          onFocusAnswer();
        };
      } catch (e) {}
    }
  }, [answerEditor, onFocusAnswer, okRef, questionEditor]);

  useEffect(() => {
    if (okRef) {
      okRef.onkeydown = (k) => {
        if (k.code === 'Tab' && questionEditor) {
          k.preventDefault();
          k.stopPropagation();
          questionEditor.focus();
        }
      };
    }
  }, [questionEditor, okRef]);

  return (
    <Fragment>
      <ToolbarTooltip toolbar={questionToolbar} />
      <ToolbarTooltip toolbar={answerToolbar} />
      <FlashcardDetail
        id={id}
        question={question}
        answer={answer}
        questionImage={questionImage}
        answerImage={answerImage}
        handleDelete={handleDelete}
        handleOpen={handleOpen}
      />
      <Dialog
        setOkRef={setOkRef}
        className={classes.dialog}
        title="Create Flashcards"
        okTitle="Save"
        secondaryOkTitle="Review Cards"
        disableOk={!enabled}
        disableActions={loadingImage}
        onCancel={handleCancel}
        onOk={handleSubmit}
        onSecondaryOk={handleDone}
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
                  curQuestionImage && classes.imageEditor,
                  focus !== 'question' && classes.noFocus
                )}
              >
                {curQuestionImage && (
                  <SelectedImage
                    image={curQuestionImage}
                    imageStyle={imageStyle}
                    handleRemoveImg={deleteQuestionImage}
                  />
                )}
                <RichTextEditor
                  setEditor={setQuestionEditor}
                  placeholder=""
                  setLoadingImage={setLoadingImage}
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
                  curAnswerImage && classes.imageEditor,
                  focus !== 'answer' && classes.noFocus
                )}
              >
                {curAnswerImage && (
                  <SelectedImage
                    image={curAnswerImage}
                    handleRemoveImg={deleteAnswerImage}
                    imageStyle={imageStyle}
                  />
                )}
                <RichTextEditor
                  placeholder=""
                  setEditor={setAnswerEditor}
                  value={curAnswer}
                  setLoadingImage={setLoadingImage}
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
};

export default React.memo(withStyles(styles)(withWidth()(FlashcardEditor)));
