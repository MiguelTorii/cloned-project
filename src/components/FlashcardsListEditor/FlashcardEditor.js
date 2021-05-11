import React, { useCallback, useEffect, useMemo, useState } from 'react';
import withRoot from '../../withRoot';
import useStyles from './styles';
import IconButton from '@material-ui/core/IconButton';
import IconMove from '@material-ui/icons/OpenWith';
import IconDelete from '@material-ui/icons/DeleteOutlined';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import RichTextEditor from './RichTextEditor';
import QuillToolbar from './QuillToolbar';
import Box from '@material-ui/core/Box';
import update from 'immutability-helper';

const EDITOR_TYPES = {
  QUESTION: 'question',
  ANSWER: 'answer'
};

type Props = {
  index: number,
  data: Object,
  active: boolean,
  dndProps: Object,
  onDelete: Function,
  onUpdateData: Function
};

const FlashcardEditor = (
  {
    index,
    data,
    active,
    dndProps,
    onDelete = () => {},
    onUpdateData
  }: Props
) => {
  // Hooks
  const classes = useStyles({ active });
  const [cardData, setCardData] = useState({
    question: null,
    questionImage: null,
    answer: null,
    answerImage: null
  });
  const [activeEditor, setActiveEditor] = useState(null);

  // Effects
  useEffect(() => {
    setCardData(data);
  }, [data, setCardData]);

  // Memos
  const questionToolbarId = useMemo(() => {
    return `flashcard-toolbar-${index}-question`;
  }, [index]);

  const answerToolbarId = useMemo(() => {
    return `flashcard-toolbar-${index}-answer`;
  }, [index]);

  // Event Handlers
  const handleUpdateField = useCallback((field, value) => {
    const newCardData = update(cardData, {
      [field]: { $set: value }
    })
    setCardData(newCardData);
    onUpdateData(index, newCardData);
  }, [index, cardData, setCardData, onUpdateData]);

  const handleDelete = useCallback(() => {
    onDelete(index);
  }, [index, onDelete]);

  const handleMouseDown = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  return (
    <div className={classes.flashcardEditorRoot}>
      <div className={clsx(classes.flashcardHeader, active && classes.gradientHeader)}>
        <div className={clsx(classes.flashcardHeaderContent, !active && classes.paddingTopZero)}>
          <div onMouseDown={handleMouseDown}>
            <IconButton
              classes={{root: classes.iconButton}}
              {...dndProps}
            >
              <IconMove />
            </IconButton>
          </div>
          <Box display={active && activeEditor !== EDITOR_TYPES.ANSWER? 'block' : 'none'}>
            <QuillToolbar elementId={questionToolbarId} />
          </Box>
          <Box display={active && activeEditor === EDITOR_TYPES.ANSWER ? 'block' : 'none'}>
            <QuillToolbar elementId={answerToolbarId} />
          </Box>
          <div onMouseDown={handleMouseDown}>
            <IconButton
              classes={{root: classes.iconButton}}
              onClick={handleDelete}
            >
              <IconDelete />
            </IconButton>
          </div>
        </div>
      </div>
      <div className={classes.flashcardContent}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={6}>
            <RichTextEditor
              label="Question"
              placeholder="e.g. Chapter 1: Basic Anatomy"
              containerId={questionToolbarId}
              value={cardData.question}
              onChangeValue={(value) => handleUpdateField('question', value)}
              imageUrl={cardData.questionImage}
              onChangeImageUrl={(value) => handleUpdateField('questionImage', value)}
              onFocus={() => setActiveEditor(EDITOR_TYPES.QUESTION)}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <RichTextEditor
              label="Answer"
              placeholder="e.g. Chapter 1: Basic Anatomy"
              containerId={answerToolbarId}
              value={cardData.answer}
              onChangeValue={(value) => handleUpdateField('answer', value)}
              imageUrl={cardData.answerImage}
              onChangeImageUrl={(value) => handleUpdateField('answerImage', value)}
              onFocus={() => setActiveEditor(EDITOR_TYPES.ANSWER)}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  )
};

export default withRoot(FlashcardEditor);
