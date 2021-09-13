// @flow
import React from 'react';
import Typography from '@material-ui/core/Typography';
import Dialog from 'components/Dialog/Dialog';
import useStyles from 'components/_styles/BlockMemberModal';

type Props = {
  closeModal: Function,
  onOk: Function,
  open: boolean,
  blockUserName: string
};

const BlockMemberModal = ({ closeModal, onOk, open, blockUserName }: Props) => {
  const classes = useStyles();

  return (
    <Dialog
      ariaDescribedBy="confirm-dialog-description"
      className={classes.dialog}
      okTitle="Block Member"
      onCancel={closeModal}
      okButtonClass={classes.okButtonClass}
      closeButtonClass={classes.cancleButtonClass}
      headerTitleClass={classes.headerTitleClass}
      hrClass={classes.hrClass}
      onOk={onOk}
      open={open}
      showActions
      showCancel
      title="Block this member?"
    >
      <Typography
        className={classes.alertTitle}
        color="textPrimary"
        id="confirm-dialog-description"
      >
        <b>{blockUserName}</b> will no longer be able to:
      </Typography>
      <li>See your posts in classes you have together</li>
      <li>Tag you</li>
      <li>Invite you to new chats</li>
      <li>Send you messages</li>
    </Dialog>
  );
};

export default BlockMemberModal;
