import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import FlashcardsDeckManager from './FlashcardsDeckManager';
import { updateFlashcards } from '../../api/posts';

const FlashcardsDeckEditor = ({ flashcardId, data, onAfterUpdate }) => {
  // Hooks
  const me = useSelector((state) => state.user.data);

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

FlashcardsDeckEditor.propTypes = {
  flashcardId: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  onAfterUpdate: PropTypes.func
};

FlashcardsDeckEditor.defaultProps = {
  onAfterUpdate: () => {}
};

export default FlashcardsDeckEditor;
