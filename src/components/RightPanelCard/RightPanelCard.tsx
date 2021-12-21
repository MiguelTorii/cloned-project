import React, { ReactElement } from 'react';
import { Box, Paper, Typography } from '@material-ui/core';
import { useStyles } from './RightPanelCardStyles';

type Props = {
  children: ReactElement;
  title: string;
  tail?: ReactElement;
};

const RightPanelCard = ({ children, title, tail }: Props) => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Box
        display="flex"
        justifyContent="space-between"
        className={classes.header}
        alignItems="center"
      >
        <Typography className={classes.title}>{title}</Typography>
        {tail}
      </Box>
      <Box className={classes.content}>{children}</Box>
    </Paper>
  );
};

export default RightPanelCard;
