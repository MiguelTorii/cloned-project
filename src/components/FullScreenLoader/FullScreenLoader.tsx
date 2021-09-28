import React from 'react';
import { Dialog, Box, Typography } from '@material-ui/core';

import RocketImage from 'assets/gif/rocket-loading.gif';

const FullScreenLoader = () => (
  <Dialog fullScreen open>
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" pt={10}>
      <img src={RocketImage} alt="rocket animation for loading" />
      <Typography variant="h6" gutterBottom>
        Hang tight!
      </Typography>
      <Typography>Pulling up your information...</Typography>
    </Box>
  </Dialog>
);

export default FullScreenLoader;
