import React, { useCallback, useState } from 'react';
import Dialog, { dialogStyle } from 'components/Dialog/Dialog';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import BlockUserIcon from 'assets/svg/block-user.svg';

const useStyles = makeStyles((theme) => ({
  dialog: {
    ...dialogStyle,
    width: 500,
    zIndex: 2100
  },
  blockLabel: {
    color: theme.circleIn.palette.danger,
    fontWeight: 700
  },
  blockButton: {
    minWidth: 164,
    background: '#FFFFFF',
    marginBottom: theme.spacing(1 / 2),
    boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.35)',
    borderRadius: 100
  }
}));
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
    <Grid container justifyContent="center">
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
