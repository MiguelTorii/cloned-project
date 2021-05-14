import React, { useCallback, useState } from 'react';
import FlashcardsDeckManager from './index';
import { createFlashcards } from '../../api/posts';
import { showNotification } from '../../actions/notifications';
import { logEvent, logEventLocally } from '../../api/analytics';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

const FlashcardsDeckCreator = () => {
  // Hooks
  const dispatch = useDispatch();
  const history = useHistory();
  const me = useSelector((state) => state.user.data);

  // States
  const [isSaving, setIsSaving] = useState(false);

  // Event Handlers
  const handleCreate = useCallback(async (data) => {
    setIsSaving(true);

    const { points, fcId } = await createFlashcards({
      userId: me.userId,
      grade: me.grade,
      tags: [],
      ...data
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
        props: { 'Number of cards': data.deck.length, Title: data.title }
      });

      logEventLocally({
        category: 'Flashcard',
        objectId: fcId,
        type: 'Created'
      });
      history.push(`/flashcards/${fcId}`);
    }
  }, [dispatch, history, me]);

  return (
    <FlashcardsDeckManager
      title="Create a new flashcard deck"
      submitText="Create"
      isSubmitting={isSaving}
      onSubmit={handleCreate}
    />
  )
};

export default FlashcardsDeckCreator;
