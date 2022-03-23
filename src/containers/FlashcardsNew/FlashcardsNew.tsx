import React from 'react';

import FlashcardsDeckCreator from 'components/FlashcardsDeckManager/FlashcardsDeckManager';
import withRoot from 'withRoot';

import useStyles from './styles';

const FlashcardsNew = () => {
  const classes: any = useStyles();
  return (
    <div className={classes.root}>
      <FlashcardsDeckCreator />
    </div>
  );
};

export default withRoot(FlashcardsNew);
