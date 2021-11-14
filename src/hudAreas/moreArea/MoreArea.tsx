import React from 'react';
import { useStyles } from './MoreAreaStyles';

const MoreArea = () => {
  const classes: any = useStyles();

  return (
    <div className={classes.container}>Support, new idea, and get the mobile app goes here.</div>
  );
};

export default MoreArea;
