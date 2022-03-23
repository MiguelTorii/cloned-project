import React, { useState } from 'react';

import Store from 'containers/Store/Store';

import { useStyles } from './RewardsStoreSubAreaStyles';

const RewardsStoreSubArea = () => {
  const classes: any = useStyles();

  return <Store />;
};

export default RewardsStoreSubArea;
