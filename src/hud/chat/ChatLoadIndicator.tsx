import React from 'react';
import { Typography } from '@material-ui/core';
import { useStyles } from './ChatLoadIndicatorStyles';
import LoadImg from '../../components/LoadImg/LoadImg';
import LoadingMessageGif from '../../assets/gif/loading-chat.gif';

const ChatLoadIndicator = () => {
  const classes: any = useStyles();

  return (
    <div className={classes.messageLoadingRoot}>
      <div className={classes.messageLoadingContainer}>
        <LoadImg url={LoadingMessageGif} className={classes.emptyChatImg} />
        <Typography className={classes.expertTitle}>Loading your conversation...</Typography>
      </div>
    </div>
  );
};

export default ChatLoadIndicator;
