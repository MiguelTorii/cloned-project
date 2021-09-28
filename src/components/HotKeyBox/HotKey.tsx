import React from 'react';
import { Box } from '@material-ui/core';
import Key from './Key';

const HotKey = ({ keys }) => (
  <Box display="flex" alignItems="center" marginLeft={6}>
    {keys.map((key, index) => (
      <React.Fragment key={key}>
        {index > 0 && (
          <Box mx={0.5} fontSize={14}>
            +
          </Box>
        )}
        <Key keyText={key} />
      </React.Fragment>
    ))}
  </Box>
);

export default HotKey;
