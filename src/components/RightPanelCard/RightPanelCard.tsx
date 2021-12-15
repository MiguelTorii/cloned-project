import React, { ReactElement } from 'react';
import { Box, Paper, Typography } from '@material-ui/core';
import { useStyles } from './RightPanelCardStyles';

type Props = {
  children: ReactElement;
  title: string;
};

const RightPanelCard = ({ children, title }: Props) => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography className={classes.title}>{title}</Typography>
      <Box className={classes.content}>{children}</Box>
    </Paper>
  );
};

export default RightPanelCard;
