import React from 'react';
import withRoot from '../../withRoot';
import useStyles from './styles';
import FlashcardsDeckCreator from '../../components/FlashcardsDeckManager/FlashcardsDeckManager';

const FlashcardsNew = () => {
  const classes: any = useStyles();
  return (
    <div className={classes.root}>
      <FlashcardsDeckCreator />
    </div>
  );
};

export default withRoot(FlashcardsNew);
