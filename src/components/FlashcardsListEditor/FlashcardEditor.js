import React, { useCallback, useMemo, useState } from 'react';
import withRoot from '../../withRoot';
import useStyles from './styles';
import IconButton from '@material-ui/core/IconButton';
import IconMove from '@material-ui/icons/OpenWith';
import IconDelete from '@material-ui/icons/DeleteOutlined';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import RichTextEditor from './RichTextEditor';
import QuillToolbar from '../QillToolbar';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';

const EDITOR_TYPES = {
  QUESTION: 'question',
  ANSWER: 'answer'
};

const FlashcardEditor = (
  {
    index,
    data,
    active,
    dndProps,
    readOnly,
    toolbarPrefix,
    onDelete,
    onUpdate
  }
) => {
  // Hooks
  const classes = useStyles({ active });
  const [activeEditor, setActiveEditor] = useState(null);

  // Memos
  const questionToolbarId = useMemo(() => {
    return `flashcard-toolbar-${toolbarPrefix}-question`;
  }, [toolbarPrefix]);

  const answerToolbarId = useMemo(() => {
    return `flashcard-toolbar-${toolbarPrefix}-answer`;
  }, [toolbarPrefix]);

  // Event Handlers
  const handleUpdateField = useCallback((field, value) => {
    onUpdate(index, field, value);
  }, [index, onUpdate]);

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
          <Box hidden={readOnly}>
            <div onMouseDown={handleMouseDown}>
              <IconButton
                classes={{root: clsx(classes.iconButton, active && 'active')}}
                {...dndProps}
              >
                <IconMove />
              </IconButton>
            </div>
          </Box>
          <Box display={active && activeEditor !== EDITOR_TYPES.ANSWER? 'block' : 'none'}>
            <QuillToolbar elementId={questionToolbarId} />
          </Box>
          <Box display={active && activeEditor === EDITOR_TYPES.ANSWER ? 'block' : 'none'}>
            <QuillToolbar elementId={answerToolbarId} />
          </Box>
          <div>
            { !readOnly && (
              <div onMouseDown={handleMouseDown}>
                <IconButton
                  classes={{root: clsx(classes.iconButton, active && 'active')}}
                  onClick={handleDelete}
                >
                  <IconDelete />
                </IconButton>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={classes.flashcardContent}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={6}>
            <RichTextEditor
              label="Question"
              placeholder="Enter a question, term, or image"
              containerId={questionToolbarId}
              readOnly={readOnly}
              value={data.question}
              onChangeValue={(value) => handleUpdateField('question', value)}
              imageUrl={data.questionImage}
              onChangeImageUrl={(value) => handleUpdateField('questionImage', value)}
              onFocus={() => setActiveEditor(EDITOR_TYPES.QUESTION)}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <RichTextEditor
              label="Answer"
              placeholder="Enter the answer or a definition"
              containerId={answerToolbarId}
              readOnly={readOnly}
              value={data.answer}
              onChangeValue={(value) => handleUpdateField('answer', value)}
              imageUrl={data.answerImage}
              onChangeImageUrl={(value) => handleUpdateField('answerImage', value)}
              onFocus={() => setActiveEditor(EDITOR_TYPES.ANSWER)}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  )
};

FlashcardEditor.propTypes = {
  index: PropTypes.number.isRequired,
  data: PropTypes.object,
  active: PropTypes.bool,
  dndProps: PropTypes.object,
  readOnly: PropTypes.bool,
  toolbarPrefix: PropTypes.string,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func
};

FlashcardEditor.defaultProps = {
  data: {},
  active: false,
  dndProps: {},
  readOnly: false,
  toolbarPrefix: PropTypes.string,
  onDelete: () => {},
  onUpdate: () => {}
};

export default withRoot(FlashcardEditor);
