import React from 'react';

import Box from '@material-ui/core/Box';

import GradientButton from 'components/Basic/Buttons/GradientButton';

const LoginPopupClose = () => {
  const handleClose = () => {
    window.close();
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <GradientButton onClick={handleClose}>Click Here to Close.</GradientButton>
    </Box>
  );
};

export default LoginPopupClose;
