import React from 'react';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

const LoadingSpin = () => (
  <Box mt={3} display="flex" justifyContent="center">
    <CircularProgress />
  </Box>
);

export default LoadingSpin;
