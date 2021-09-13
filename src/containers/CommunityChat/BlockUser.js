import React, { useCallback, useState } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Dialog from 'components/Dialog/Dialog';
import BlockUserIcon from 'assets/svg/block-user.svg';
import useStyles from './_styles/blockUser';

const BlockUser = ({ otherUser, userId, handleBlock }) => {
  const classes = useStyles();
  const [blockUser, setBlockUser] = useState(false);

  const handleOpenBlock = useCallback((v) => () => setBlockUser(v), []);

  const onOk = async () => {
    if (userId !== otherUser.userId) await handleBlock(otherUser.userId);
    handleOpenBlock(false)();
  };

  if (!otherUser) return null;
  return (
    <Grid container justify="center">
      <Button
        onClick={handleOpenBlock(true)}
        startIcon={<img src={BlockUserIcon} alt="block user" />}
        variant="outlined"
        classes={{
          label: classes.blockLabel,
          root: classes.blockButton
        }}
      >
        Block {otherUser.firstname}
      </Button>
      <Dialog
        ariaDescribedBy="confirm-dialog-description"
        className={classes.dialog}
        okTitle="Yes, I'm sure"
        onCancel={handleOpenBlock(false)}
        onOk={onOk}
        open={blockUser}
        showActions
        showCancel
        title="Block User"
      >
        <Typography color="textPrimary" id="confirm-dialog-description">
          Are you sure you want to block {otherUser.firstName}{' '}
          {otherUser.lastName}
        </Typography>
      </Dialog>
    </Grid>
  );
};

export default BlockUser;
