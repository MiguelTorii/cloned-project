import React from 'react';
import emptyNotes from 'assets/svg/emptyNotes.svg';
import LoadImg from 'components/LoadImg/LoadImg';
import { useStyles } from '../_styles/UserNotesEditor';

const Empty = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <LoadImg alt="empty-notes" url={emptyNotes} className={classes.image} />
      <div className={classes.title}>
        Now, you can type class notes right inside of CircleIn.
      </div>
      <div className={classes.subtitle}>
        Organization just got so much easier.
      </div>
    </div>
  );
};

export default Empty;
