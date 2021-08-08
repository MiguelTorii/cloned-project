import React, { useCallback, useMemo, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import IconMove from '@material-ui/icons/OpenWith';
import IconDelete from '@material-ui/icons/DeleteOutlined';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import OutsideClickHandler from 'react-outside-click-handler';
import RichTextEditor from './RichTextEditor';
import QuillToolbar from '../QillToolbar';
import useStyles from './styles';

const EDITOR_TYPES = {
  QUESTION: 'question',
  ANSWER: 'answer',
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
  forwardedRef,
}) => {
  // Hooks
  const classes = useStyles();

  // States
  const [active, setActive] = useState(false);
  const [activeEditor, setActiveEditor] = useState(null);

  // Memos
  const questionToolbarId = useMemo(
    () => `flashcard-toolbar-${toolbarPrefix}-question`,
    [toolbarPrefix]
  );

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

  const handleClickEditor = useCallback(() => {
    if (!readOnly) setActive(true);
  }, [readOnly]);

  const handleOutsideClick = useCallback(() => {
    if (!readOnly) setActive(false);
  }, [readOnly]);

  // Rendering Helpers
  const Toolbars = useMemo(
    () => (
      <>
        <Box
          display={
            active && activeEditor !== EDITOR_TYPES.ANSWER ? 'block' : 'none'
          }
        >
          <QuillToolbar elementId={questionToolbarId} />
        </Box>
        <Box
          display={
            active && activeEditor === EDITOR_TYPES.ANSWER ? 'block' : 'none'
          }
        >
          <QuillToolbar elementId={answerToolbarId} />
        </Box>
      </>
    ),
    [active, activeEditor]
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
            active={active && activeEditor === EDITOR_TYPES.QUESTION}
            value={data.question}
            imageUrl={data.questionImage}
            onChangeImageUrl={(value) =>
              handleUpdateField('questionImage', value)
            }
            onFocus={() => setActiveEditor(EDITOR_TYPES.QUESTION)}
            onSetRef={handleSetQuestionRef}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <RichTextEditor
            label="Answer"
            placeholder="Enter the answer or a definition"
            containerId={answerToolbarId}
            readOnly={readOnly}
            active={active && activeEditor === EDITOR_TYPES.ANSWER}
            value={data.answer}
            imageUrl={data.answerImage}
            onChangeImageUrl={(value) =>
              handleUpdateField('answerImage', value)
            }
            onFocus={() => setActiveEditor(EDITOR_TYPES.ANSWER)}
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
      activeEditor
    ]
  );

  return (
    <OutsideClickHandler onOutsideClick={handleOutsideClick}>
      <div
        className={classes.flashcardEditorRoot}
        onMouseDown={handleClickEditor}
        ref={forwardedRef}
      >
        <div
          className={clsx(
            classes.flashcardHeader,
            active && classes.gradientHeader
          )}
        >
          <div
            className={clsx(
              classes.flashcardHeaderContent,
              !active && classes.paddingTopZero
            )}
          >
            <Box hidden={readOnly}>
              <div onMouseDown={handleMouseDown}>
                <IconButton
                  classes={{
                    root: clsx(classes.iconButton, active && 'active'),
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
                      root: clsx(classes.iconButton, active && 'active'),
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
    </OutsideClickHandler>
  );
};

FlashcardEditor.propTypes = {
  index: PropTypes.number.isRequired,
  inViewport: PropTypes.bool,
  data: PropTypes.object,
  dndProps: PropTypes.object,
  readOnly: PropTypes.bool,
  toolbarPrefix: PropTypes.string,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
  onSetRef: PropTypes.func,
};

FlashcardEditor.defaultProps = {
  inViewport: false,
  data: {},
  dndProps: {},
  readOnly: false,
  toolbarPrefix: PropTypes.string,
  onDelete: () => {},
  onUpdate: () => {},
  onSetRef: () => {},
};

export default FlashcardEditor;
