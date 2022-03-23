/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import useStyles from './_styles/emptyLeftMenu';

type Props = {
  isLoading: boolean;
  emptyChannels: boolean;
  handleCreateNewChannel: (...args: Array<any>) => any;
};

const EmptyLeftMenu = ({ isLoading, emptyChannels, handleCreateNewChannel }: Props) => {
  const classes: any = useStyles();
  return (
    <div className={classes.container}>
      {emptyChannels && !isLoading && (
        <div className={classes.messageContainer}>
          <Typography
            role="img"
            classes={{
              root: classes.message
            }}
          >
            You have no messages yet. <br />
            Once you’ve sent or received messages, you’ll see them here.
            <br /> <br />
            Click the button below to start chatting!
          </Typography>

          <Button
            variant="contained"
            className={classes.createDM}
            onClick={handleCreateNewChannel}
            color="primary"
          >
            Create New Message
          </Button>
        </div>
      )}

      {isLoading && (
        <div className={classes.loading}>
          <CircularProgress
            classes={{
              colorPrimary: classes.loadingChannels
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EmptyLeftMenu;
