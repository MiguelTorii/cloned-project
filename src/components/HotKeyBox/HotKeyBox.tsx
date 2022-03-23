import React from 'react';

import { Box, Typography } from '@material-ui/core';

import HotKey from './HotKey';
import useStyles from './styles';

const HotKeyBox = ({ data }) => {
  const classes: any = useStyles();
  return (
    <Box className={classes.root}>
      <Typography className={classes.title}>Keyboard Shortcuts</Typography>
      {data.map((hotKeyItem) => (
        <Box
          marginTop={1}
          display="flex"
          key={hotKeyItem.description}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography>{hotKeyItem.description}</Typography>
          <Box>
            <HotKey keys={hotKeyItem.keys} />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default HotKeyBox;
