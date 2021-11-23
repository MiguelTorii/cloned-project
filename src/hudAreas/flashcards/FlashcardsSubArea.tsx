import React from 'react';
import { useParams } from 'react-router';
import FlashcardsList from '../../containers/FlashcardsList/FlashcardsList';
import { useStyles } from './FlashcardsSubAreaStyles';
import FlashcardsShow from '../../containers/FlashcardsShow/FlashcardsShow';

const FlashcardsSubArea = () => {
  const classes: any = useStyles();

  const { flashcardId } = useParams();

  if (flashcardId) {
    return <FlashcardsShow />;
  }
  return <FlashcardsList />;
};

export default FlashcardsSubArea;
