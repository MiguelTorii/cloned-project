import React from 'react';
import withRoot from '../../withRoot';
import Button from '@material-ui/core/Button';
import useStyles from './styles';

const AddDeckButton = ({ onClick }) => {
  const classes = useStyles();

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

export default withRoot(AddDeckButton);
