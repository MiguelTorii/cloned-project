import React from 'react';
import { useLocation, useParams } from 'react-router';
import FlashcardsList from '../../containers/FlashcardsList/FlashcardsList';
import FlashcardsShow from '../../containers/FlashcardsShow/FlashcardsShow';
import FlashcardsEdit from 'containers/FlashcardsEdit/FlashcardsEdit';

const FlashcardsSubArea = () => {
  const { flashcardId } = useParams();
  const { pathname } = useLocation();

  if (pathname.startsWith('/edit/flashcards')) {
    return <FlashcardsEdit flashcardId={flashcardId} />;
  }

  if (flashcardId) {
    return <FlashcardsShow />;
  }
  return <FlashcardsList />;
};

export default FlashcardsSubArea;
