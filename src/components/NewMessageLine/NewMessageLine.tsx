import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  text: {
    background: 'linear-gradient(#94DAF9, #1E88E5)',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
    paddingRight: theme.spacing(2),
    fontWeight: 600
  },
  line: {
    height: 1,
    width: '100%',
    background: 'linear-gradient(115.22deg, #94DAF9 -9.12%, #1E88E5 90.34%)'
  }
}));

const NewMessageLine = () => {
  const classes = useStyles();

  return (
    <Box>
      <Typography className={classes.text} align="right">
        NEW!
      </Typography>
      <Box className={classes.line} />
    </Box>
  );
};

export default NewMessageLine;
