import React from 'react';
import { useParams } from 'react-router';
import FlashcardsList from '../../containers/FlashcardsList/FlashcardsList';
import FlashcardsShow from '../../containers/FlashcardsShow/FlashcardsShow';

const FlashcardsSubArea = () => {
  const { flashcardId } = useParams();

  if (flashcardId) {
    return <FlashcardsShow />;
  }
  return <FlashcardsList />;
};

export default FlashcardsSubArea;
