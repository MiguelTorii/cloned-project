import React, { useState } from 'react';
import { useStyles } from './RewardsStoreSubAreaStyles';
import Store from '../../containers/Store/Store';

const RewardsStoreSubArea = () => {
  const classes: any = useStyles();

  return <Store />;
};

export default RewardsStoreSubArea;
