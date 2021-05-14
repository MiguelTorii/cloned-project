import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import FlashcardsDeckManager from './index';
import { useSelector } from 'react-redux';
import { updateFlashcards } from '../../api/posts';

const FlashcardsDeckEditor = (
  {
    flashcardId,
    data,
    onAfterUpdate
  }
) => {
  // Hooks
  const me = useSelector((state) => state.user.data);

  // States
  const [isSaving, setIsSaving] = useState(false);

  // Event Handlers
  const handleUpdate = useCallback(async (updatedData) => {
    setIsSaving(true);

    await updateFlashcards({
      flashcardId: flashcardId,
      userId: me.userId,
      ...updatedData
    })

    setIsSaving(false);
    onAfterUpdate(updatedData);
  }, [onAfterUpdate, setIsSaving, me.userId, flashcardId]);

  return (
    <FlashcardsDeckManager
      data={data}
      title="Edit flashcard deck"
      submitText="Save"
      isSubmitting={isSaving}
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
