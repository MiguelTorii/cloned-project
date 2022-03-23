import React, { useCallback, useState } from 'react';

import { useSelector } from 'react-redux';

import { updateFlashcards } from 'api/posts';

import FlashcardsDeckManager from './FlashcardsDeckManager';

const FlashcardsDeckEditor = ({ flashcardId, data, onAfterUpdate }) => {
  // Hooks
  const me = useSelector((state) => (state as any).user.data);
  // States
  const [isSaving, setIsSaving] = useState(false);
  // Event Handlers
  const handleUpdate = useCallback(
    async (updatedData) => {
      setIsSaving(true);
      await updateFlashcards({
        flashcardId,
        userId: me.userId,
        ...updatedData
      });
      setIsSaving(false);
      onAfterUpdate(updatedData);
    },
    [onAfterUpdate, setIsSaving, me.userId, flashcardId]
  );
  return (
    <FlashcardsDeckManager
      data={data}
      title="Edit flashcard deck"
      submitText="Save"
      isSubmitting={isSaving}
      disableClass
      onSubmit={handleUpdate}
    />
  );
};

FlashcardsDeckEditor.defaultProps = {
  onAfterUpdate: () => {}
};
export default FlashcardsDeckEditor;
