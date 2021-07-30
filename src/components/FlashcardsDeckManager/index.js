import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import update from 'immutability-helper';
import { useDispatch, useSelector } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import { extractTextFromHtml } from 'utils/helpers';
import { showNotification } from 'actions/notifications';
import GradientButton from '../Basic/Buttons/GradientButton';
import FlashcardsListEditor from '../FlashcardsListEditor';
import TextField from '../Basic/TextField';
import withRoot from '../../withRoot';

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
  const [deckData, setDeckData] = useState({
    title: null,
    summary: null,
    classId: null,
    sectionId: null,
    deck: [
      {
        id: 1,
        question: '',
        answer: ''
      }
    ]
  });

  // Effects
  useEffect(() => {
    if (data) setDeckData(data);
  }, [data]);

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
    if (deckData.classId && deckData.sectionId) {
      return `${deckData.classId}_${deckData.sectionId}`;
    }

    return '';
  }, [deckData]);

  // Event Handlers
  const handleUpdateField = useCallback((field, value) => {
    setDeckData((data) =>
      update(data, {
        [field]: { $set: value }
      })
    );
  }, []);

  const handleUpdateFlashcardField = useCallback((index, field, value) => {
    setDeckData((data) =>
      update(data, {
        deck: {
          [index]: (item) =>
            update(item, {
              [field]: { $set: value }
            })
        }
      })
    );
  }, []);

  const handleSubmit = useCallback(() => {
    if (!deckData.title || !deckData.classId) {
      setIsValidated(true);
      return;
    }

    const data = update(deckData, {
      deck: (arr) =>
        arr.filter(
          (card) =>
            (card.questionImage || !!extractTextFromHtml(card.question)) &&
            (card.answerImage || !!extractTextFromHtml(card.answer))
        )
    });

    if (deckData.deck.length === 0) {
      dispatch(
        showNotification({
          message: 'You must have at least one flashcard to save the deck.',
          variant: 'error'
        })
      );
      return;
    }

    if (data.deck.length < deckData.deck.length) {
      dispatch(
        showNotification({
          message: 'Flashcards should not be empty.',
          variant: 'error'
        })
      );
      return;
    }

    onSubmit(data);
  }, [deckData, onSubmit, dispatch]);

  const handleChangeClass = useCallback(
    (event) => {
      const [classId, sectionId] = event.target.value.split('_');
      setDeckData(
        update(deckData, {
          classId: { $set: Number(classId) },
          sectionId: { $set: Number(sectionId) }
        })
      );
    },
    [deckData]
  );

  // Rendering Helpers
  const renderForm = () => (
    <Box mt={4} mb={4}>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <TextField
            required
            fullWidth
            error={isValidated && !deckData.title}
            InputLabelProps={{
              shrink: true
            }}
            helperText={
              isValidated && !deckData.title && 'Please input a title'
            }
            label="Title"
            placeholder="Add a title"
            value={deckData.title || ''}
            onChange={(event) => handleUpdateField('title', event.target.value)}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TextField
            fullWidth
            required
            select
            error={isValidated && !deckData.classId}
            InputLabelProps={{
              shrink: true
            }}
            label="Class"
            helperText={
              isValidated && !deckData.classId && 'Please select your class'
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
            value={deckData.summary || ''}
            onChange={(event) =>
              handleUpdateField('summary', event.target.value)
            }
          />
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
      <FlashcardsListEditor
        data={deckData.deck}
        onUpdate={(data) => handleUpdateField('deck', data)}
        onUpdateFlashcardField={handleUpdateFlashcardField}
      />
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

export default withRoot(FlashcardsDeckManager);
