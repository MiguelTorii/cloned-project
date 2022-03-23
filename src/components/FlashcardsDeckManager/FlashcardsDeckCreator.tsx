import React, { useCallback, useMemo, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import store from 'store';

import { STORAGE_KEYS } from 'constants/app';

import { showNotification } from 'actions/notifications';
import { logEvent, logEventLocally } from 'api/analytics';
import { createFlashcards } from 'api/posts';

import FlashcardsDeckManager from './FlashcardsDeckManager';

const FlashcardsDeckCreator = () => {
  // Hooks
  const dispatch = useDispatch();
  const history = useHistory();
  const me = useSelector((state) => (state as any).user.data);
  // States
  const [isSaving, setIsSaving] = useState(false);
  const initialData = useMemo(() => store.get(STORAGE_KEYS.FLASHCARD_CACHE) || null, []);
  // Event Handlers
  const handleCreate = useCallback(
    async (data) => {
      setIsSaving(true);
      const { points, fcId } = await createFlashcards({
        userId: me.userId,
        grade: me.grade,
        tags: [],
        ...data
      });
      setIsSaving(false);

      if (!fcId) {
        dispatch(
          showNotification({
            message: 'Sorry, failed to create a flashcard deck.',
            variant: 'error'
          })
        );
      } else {
        dispatch(
          showNotification({
            message: `Congratulations ${me.firstName}, you have just earned ${points} points. Good Work!`,
            variant: 'info',
            nextPath: '/flashcards'
          })
        );
        logEvent({
          event: 'Feed- Create Flashcards',
          props: {
            'Number of cards': data.deck.length,
            Title: data.title
          }
        });
        logEventLocally({
          category: 'Flashcard',
          objectId: String(fcId),
          type: 'Created'
        });
        store.remove(STORAGE_KEYS.FLASHCARD_CACHE);
        history.push(`/flashcards/${fcId}?source=deck`);
      }
    },
    [dispatch, history, me]
  );
  return (
    <FlashcardsDeckManager
      data={initialData}
      title="Create a new flashcard deck"
      submitText="Create"
      isSubmitting={isSaving}
      onSubmit={handleCreate}
    />
  );
};

export default FlashcardsDeckCreator;
