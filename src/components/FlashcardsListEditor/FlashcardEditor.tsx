import React, { useCallback, useContext, useMemo } from 'react';
import IconButton from '@material-ui/core/IconButton';
import IconMove from '@material-ui/icons/OpenWith';
import IconDelete from '@material-ui/icons/DeleteOutlined';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import RichTextEditor from './RichTextEditor';
import QuillToolbar from '../QillToolbar/QuillToolbar';
import useStyles from './styles';
import { FlashcardListContext } from './FlashcardListContext';
import { EDITOR_TYPES } from './FlashcardsListEditor';

type Props = {
  index?: any;
  data?: any;
  dndProps?: any;
  readOnly?: any;
  toolbarPrefix?: any;
  onDelete?: any;
  onSetRef?: any;
  onUpdate?: any;
  forwardedRef?: any;
};

const FlashcardEditor = ({
  index,
  data,
  dndProps,
  readOnly,
  toolbarPrefix,
  onDelete,
  onSetRef,
  onUpdate,
  forwardedRef
}: Props) => {
  // Hooks
  const classes: any = useStyles();
  const { activeFlashcard, setActiveFlashcard } = useContext(FlashcardListContext);
  // Memos
  const questionToolbarId = useMemo(
    () => `flashcard-toolbar-${toolbarPrefix}-question`,
    [toolbarPrefix]
  );
  const active = useMemo(() => index === activeFlashcard.index, [index, activeFlashcard]);
  const answerToolbarId = useMemo(
    () => `flashcard-toolbar-${toolbarPrefix}-answer`,
    [toolbarPrefix]
  );
  // Event Handlers
  const handleUpdateField = useCallback(
    (field, value) => {
      onUpdate(index, field, value);
    },
    [index, onUpdate]
  );
  const handleDelete = useCallback(() => {
    onDelete(index);
  }, [index, onDelete]);
  const handleMouseDown = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);
  const handleSetQuestionRef = useCallback(
    (el) => {
      onSetRef(data.id, 'question', el);
    },
    [data, onSetRef]
  );
  const handleSetAnswerRef = useCallback(
    (el) => {
      onSetRef(data.id, 'answer', el);
    },
    [data, onSetRef]
  );

  // Rendering Helpers
  const Toolbars = useMemo(
    () => (
      <>
        <Box display={active && EDITOR_TYPES.QUESTION === activeFlashcard.card ? 'block' : 'none'}>
          <QuillToolbar elementId={questionToolbarId} />
        </Box>
        <Box display={active && EDITOR_TYPES.ANSWER === activeFlashcard.card ? 'block' : 'none'}>
          <QuillToolbar elementId={answerToolbarId} />
        </Box>
      </>
    ),
    [active, activeFlashcard]
  );
  const TextBoxes = useMemo(
    () => (
      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          <RichTextEditor
            label="Question"
            placeholder="Enter a question, term, or image"
            containerId={questionToolbarId}
            readOnly={readOnly}
            active={active && activeFlashcard.card === EDITOR_TYPES.QUESTION}
            value={data.question}
            imageUrl={data.questionImage}
            onChangeImageUrl={(value) => handleUpdateField('questionImage', value)}
            onFocus={() => {
              setActiveFlashcard({
                index,
                card: EDITOR_TYPES.QUESTION
              });
            }}
            onSetRef={handleSetQuestionRef}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <RichTextEditor
            label="Answer"
            placeholder="Enter the answer or a definition"
            containerId={answerToolbarId}
            readOnly={readOnly}
            active={active && activeFlashcard.card === EDITOR_TYPES.ANSWER}
            value={data.answer}
            imageUrl={data.answerImage}
            onChangeImageUrl={(value) => handleUpdateField('answerImage', value)}
            onFocus={() => {
              setActiveFlashcard({
                index,
                card: EDITOR_TYPES.ANSWER
              });
            }}
            onSetRef={handleSetAnswerRef}
          />
        </Grid>
      </Grid>
    ),
    [
      classes,
      handleUpdateField,
      handleSetAnswerRef,
      handleSetQuestionRef,
      answerToolbarId,
      questionToolbarId,
      readOnly,
      data,
      active,
      activeFlashcard,
      setActiveFlashcard
    ]
  );
  return (
    <div className={classes.flashcardEditorRoot} ref={forwardedRef}>
      <div className={clsx(classes.flashcardHeader, active && classes.gradientHeader)}>
        <div className={clsx(classes.flashcardHeaderContent, !active && classes.paddingTopZero)}>
          <Box hidden={readOnly}>
            <div onMouseDown={handleMouseDown}>
              <IconButton
                classes={{
                  root: clsx(classes.iconButton, active && 'active')
                }}
                {...dndProps}
              >
                <IconMove />
              </IconButton>
            </div>
          </Box>
          {Toolbars}
          <div>
            {!readOnly && (
              <div onMouseDown={handleMouseDown}>
                <IconButton
                  classes={{
                    root: clsx(classes.iconButton, active && 'active')
                  }}
                  onClick={handleDelete}
                >
                  <IconDelete />
                </IconButton>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={classes.flashcardContent}>{TextBoxes}</div>
    </div>
  );
};

FlashcardEditor.propTypes = {
  index: PropTypes.number.isRequired,
  inViewport: PropTypes.bool,
  data: PropTypes.shape({
    answer: PropTypes.string,
    answerImage: PropTypes.string,
    id: PropTypes.number,
    question: PropTypes.string,
    questionImage: PropTypes.string
  }),
  dndProps: PropTypes.shape({
    'aria-describedby': PropTypes.string.isRequired,
    'data-rbd-drag-handle-context-id': PropTypes.string.isRequired,
    'data-rbd-drag-handle-draggable-id': PropTypes.string.isRequired,
    draggable: PropTypes.bool.isRequired,
    onDragStart: PropTypes.func.isRequired,
    role: PropTypes.string.isRequired,
    tabIndex: PropTypes.number.isRequired
  }),
  readOnly: PropTypes.bool,
  toolbarPrefix: PropTypes.string,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
  onSetRef: PropTypes.func
};
FlashcardEditor.defaultProps = {
  inViewport: false,
  data: {},
  dndProps: {},
  readOnly: false,
  toolbarPrefix: PropTypes.string,
  onDelete: () => {},
  onUpdate: () => {},
  onSetRef: () => {}
};
export default FlashcardEditor;
