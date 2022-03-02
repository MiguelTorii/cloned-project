import Box from '@material-ui/core/Box';
import React from 'react';

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`scrollable-auto-tabpanel-${index}`}
    aria-labelledby={`scrollable-auto-tab-${index}`}
    {...other}
  >
    {value === index && <Box p={3}>{children}</Box>}
  </div>
);

export default TabPanel;
