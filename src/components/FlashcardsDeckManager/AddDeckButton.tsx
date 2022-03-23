import React from 'react';

import Button from '@material-ui/core/Button';

import useStyles from './styles';

const AddDeckButton = ({ onClick }) => {
  const classes: any = useStyles();
  return (
    <Button
      classes={{
        root: classes.addDeckButton
      }}
      onClick={onClick}
    >
      + ADD A NEW FLASHCARD
    </Button>
  );
};

export default AddDeckButton;
