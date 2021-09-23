import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import update from 'immutability-helper';
import store from 'store';
import { useDispatch, useSelector } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import { extractTextFromHtml } from 'utils/helpers';
import { showNotification } from 'actions/notifications';
import GradientButton from '../Basic/Buttons/GradientButton';
import FlashcardsListEditor from '../FlashcardsListEditor/FlashcardsListEditor';
import TextField from '../Basic/TextField/TextField';
import { INTERVAL, STORAGE_KEYS } from '../../constants/app';
import HotKeyGuide from '../HotKeyGuide/HotKeyGuide';

const HOT_KEYS = [
  {
    description: 'Next field or card',
    keys: ['Tab']
  },
  {
    description: 'Previous field',
    keys: ['Shift', 'Tab']
  }
];

const FlashcardsDeckManager = ({
  data,
  title,
  submitText,
  isSubmitting,
  disableClass,
  onSubmit
}) => {
  // Hooks
  const myClasses = useSelector((state) => state.user.userClasses.classList);
  const dispatch = useDispatch();

  // States
  const [isValidated, setIsValidated] = useState(false);
  const [editorRefs, setEditorRefs] = useState({});
  const [formData, setFormData] = useState({
    title: null,
    summary: null,
    classId: null,
    sectionId: null
  });
  const [deckData, setDeckData] = useState([]);

  // Effects
  useEffect(() => {
    if (data) {
      setDeckData(data.deck);
      setFormData({
        title: data.title,
        summary: data.summary,
        classId: data.classId,
        sectionId: data.sectionId
      });
    } else {
      setDeckData([
        {
          id: 1,
          question: '',
          answer: ''
        }
      ]);
    }
  }, [data]);

  useEffect(() => {
    const listener = (event) => {
      if (event.keyCode === 9) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    document.addEventListener('keydown', listener);

    return () => document.removeEventListener('keydown', listener);
  }, []);

  // Memos
  const dropdownOptions = useMemo(() => {
    const result = [];

    myClasses.forEach((classData) => {
      if (classData.isCurrent) {
        classData.section.forEach((section) => {
          result.push({
            value: `${classData.classId}_${section.sectionId}`,
            text: `${section.subject} ${classData.className}: - ${section.section}`
          });
        });
      }
    });

    return result;
  }, [myClasses]);

  const selectedDropdownValue = useMemo(() => {
    if (formData.classId && formData.sectionId) {
      return `${formData.classId}_${formData.sectionId}`;
    }

    return '';
  }, [formData]);

  // Event Handlers
  const handleUpdateField = useCallback((field, value) => {
    setFormData((data) =>
      update(data, {
        [field]: { $set: value }
      })
    );
  }, []);

  const handleUpdateFlashcardField = useCallback((index, field, value) => {
    setDeckData((data) =>
      update(data, {
        [index]: (item) =>
          update(item, {
            [field]: { $set: value }
          })
      })
    );
  }, []);

  const handleSetRef = useCallback((id, type, ref) => {
    setEditorRefs((data) => ({
      ...data,
      [`${id}-${type}`]: ref
    }));
  }, []);

  const getContentFromRef = useCallback((ref) => {
    if (!ref) { return null; }
    if (typeof ref.getEditor !== 'function') { return null; }
    const editor = ref.getEditor();
    const unprivilegedEditor = ref.makeUnprivilegedEditor(editor);
    return unprivilegedEditor.getHTML();
  }, []);

  const mergeEditorData = useCallback(
    (data) =>
      data.map((card) => {
        const question = getContentFromRef(editorRefs[`${card.id}-question`]);
        const answer = getContentFromRef(editorRefs[`${card.id}-answer`]);
        if (question) { card.question = question; }
        if (answer) { card.answer = answer; }
        return card;
      }),
    [editorRefs]
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Only if creating flashcards
      if (!disableClass) {
        store.set(STORAGE_KEYS.FLASHCARD_CACHE, {
          ...formData,
          deck: mergeEditorData(deckData)
        });
      }
    }, 5 * INTERVAL.SECOND);

    return () => clearInterval(intervalId);
  }, [deckData, mergeEditorData, formData, disableClass]);

  const handleSubmit = useCallback(() => {
    if (!formData.title || !formData.classId) {
      setIsValidated(true);
      return;
    }

    const data = mergeEditorData(deckData).filter(
      (card) =>
        (card.questionImage || !!extractTextFromHtml(card.question)) &&
        (card.answerImage || !!extractTextFromHtml(card.answer))
    );

    if (deckData.length === 0) {
      dispatch(
        showNotification({
          message: 'You must have at least one flashcard to save the deck.',
          variant: 'error'
        })
      );
      return;
    }

    if (data.length < deckData.length) {
      dispatch(
        showNotification({
          message: 'Flashcards should not be empty.',
          variant: 'error'
        })
      );
      return;
    }

    onSubmit({
      ...formData,
      deck: data
    });
  }, [formData, deckData, onSubmit, dispatch, mergeEditorData]);

  const handleChangeClass = useCallback(
    (event) => {
      const [classId, sectionId] = event.target.value.split('_');
      setFormData(
        update(formData, {
          classId: { $set: Number(classId) },
          sectionId: { $set: Number(sectionId) }
        })
      );
    },
    [formData]
  );

  // Rendering Helpers
  const renderForm = () => (
    <Box mt={4} mb={4}>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <TextField
            required
            fullWidth
            error={isValidated && !formData.title}
            InputLabelProps={{
              shrink: true
            }}
            helperText={
              isValidated && !formData.title && 'Please input a title'
            }
            label="Title"
            placeholder="Add a title"
            value={formData.title || ''}
            onChange={(event) => handleUpdateField('title', event.target.value)}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TextField
            fullWidth
            required
            select
            error={isValidated && !formData.classId}
            InputLabelProps={{
              shrink: true
            }}
            label="Class"
            helperText={
              isValidated && !formData.classId && 'Please select your class'
            }
            placeholder="Select your class"
            disabled={disableClass}
            value={selectedDropdownValue}
            onChange={handleChangeClass}
          >
            {dropdownOptions.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.text}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} lg={6}>
          <TextField
            fullWidth
            InputLabelProps={{
              shrink: true
            }}
            label="Description"
            placeholder="Add a description"
            value={formData.summary || ''}
            onChange={(event) =>
              handleUpdateField('summary', event.target.value)
            }
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Box display="flex" justifyContent="flex-end">
            <HotKeyGuide data={HOT_KEYS} />
          </Box>
        </Grid>
        {/* <Grid item xs={12} lg={6}> */}
        {/*  <Box display="flex" justifyContent="flex-end" alignItems="center"> */}
        {/*    <Typography>Visible to class</Typography> */}
        {/*    <IosSwitch /> */}
        {/*  </Box> */}
        {/* </Grid> */}
      </Grid>
    </Box>
  );

  const ListEditor = useMemo(
    () => (
      <FlashcardsListEditor
        onSetRef={handleSetRef}
        data={deckData}
        onUpdate={setDeckData}
        onUpdateFlashcardField={handleUpdateFlashcardField}
      />
    ),
    [deckData, handleSetRef, handleUpdateFlashcardField]
  );

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">{title}</Typography>
        <GradientButton
          loading={isSubmitting}
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {submitText}
        </GradientButton>
      </Box>
      {renderForm()}
      {ListEditor}
    </Container>
  );
};

FlashcardsDeckManager.propTypes = {
  title: PropTypes.string.isRequired,
  submitText: PropTypes.string,
  data: PropTypes.object,
  isSubmitting: PropTypes.bool,
  disableClass: PropTypes.bool,
  onSubmit: PropTypes.func
};

FlashcardsDeckManager.defaultProps = {
  submitText: 'Save',
  data: null,
  isSubmitting: false,
  disableClass: false,
  onSubmit: () => {}
};

export default FlashcardsDeckManager;
