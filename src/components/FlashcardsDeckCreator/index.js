import React, { useCallback, useMemo, useState } from 'react';
import withRoot from '../../withRoot';
import Box from '@material-ui/core/Box';
import Grid from "@material-ui/core/Grid";
import TextField from '../Basic/TextField';
import Typography from "@material-ui/core/Typography";
import IosSwitch from '../IosSwitch';
import update from 'immutability-helper';
import { useDispatch, useSelector } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import FlashcardsListEditor from '../FlashcardsListEditor';
import GradientButton from '../Basic/Buttons/GradientButton';
import { createFlashcards } from '../../api/posts';
import { useHistory } from 'react-router';
import { showNotification } from '../../actions/notifications';
import { logEvent, logEventLocally } from '../../api/analytics';

const FlashcardsDeckCreator = () => {
  // Hooks
  const myClasses = useSelector((state) => state.user.userClasses.classList);
  const me = useSelector((state) => state.user.data);
  const history = useHistory();
  const dispatch = useDispatch();

  // States
  const [isValidated, setIsValidated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deckData, setDeckData] = useState({
    title: null,
    summary: null,
    classId: null,
    sectionId: null,
    deck: []
  });

  // Memos
  const dropdownOptions = useMemo(() => {
    const result = [];

    myClasses.forEach((classData) => {
      classData.section.forEach((section) => {
        result.push({
          value: `${classData.classId}_${section.sectionId}`,
          text: `${section.subject} ${classData.className}: - ${section.section}`
        });
      });
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
    setDeckData(update(deckData, {
      [field]: { $set: value }
    }));
  }, [deckData, setDeckData]);

  const handleCreate = useCallback(async () => {
    if (!deckData.title || !deckData.classId) {
      setIsValidated(true);
      return ;
    }

    setIsSaving(true);
    const { points, fcId } = await createFlashcards({
      userId: me.userId,
      grade: me.grade,
      tags: [],
      ...deckData
    });
    setIsSaving(false);

    if (!fcId) {
      dispatch(showNotification({
        message: 'Sorry, failed to create a flashcard deck.',
        variant: 'error'
      }));
    } else {
      dispatch(showNotification({
        message: `Congratulations ${me.firstName}, you have just earned ${points} points. Good Work!`,
        variant: 'info',
        nextPath: '/flashcards'
      }));
      logEvent({
        event: 'Feed- Create Flashcards',
        props: { 'Number of cards': deckData.deck.length, Title: deckData.title }
      });

      logEventLocally({
        category: 'Flashcard',
        objectId: fcId,
        type: 'Created'
      });
      history.push('/flashcards');
    }
  }, [setIsValidated, deckData, me, history, dispatch]);

  const handleChangeClass = useCallback((event) => {
    const [classId, sectionId] = event.target.value.split('_');
    setDeckData(update(deckData, {
      classId: { $set: Number(classId) },
      sectionId: { $set: Number(sectionId) }
    }));
  }, [deckData, setDeckData]);

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
            helperText="Please input a title"
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
            helperText="Please select your class"
            placeholder="Select your class"
            value={selectedDropdownValue}
            onChange={handleChangeClass}
          >
            {
              dropdownOptions.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  { item.text }
                </MenuItem>
              ))
            }
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
            onChange={(event) => handleUpdateField('summary', event.target.value)}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Box display="flex" justifyContent="flex-end" alignItems="center">
            <Typography>Visible to class</Typography>
            <IosSwitch />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">
          Create a new flashcard deck
        </Typography>
        <GradientButton
          loading={isSaving}
          disabled={isSaving}
          onClick={handleCreate}
        >
          Create
        </GradientButton>
      </Box>
      { renderForm() }
      <FlashcardsListEditor
        initialList={deckData.deck}
        onUpdate={(data) => handleUpdateField('deck', data)}
      />
    </>
  );
};

export default withRoot(FlashcardsDeckCreator);
