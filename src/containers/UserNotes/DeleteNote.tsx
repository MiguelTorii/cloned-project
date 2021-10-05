import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '../../components/Dialog/Dialog';

const useStyles = makeStyles(() => ({
  archiveTitle: {},
  dialog: {}
}));

const DeleteNote = ({ handleDeleteNote, confirmDelete, closeConfirmDelete }) => {
  const classes: any = useStyles();
  return (
    <Dialog
      className={classes.dialog}
      onCancel={closeConfirmDelete}
      open={confirmDelete !== null}
      onOk={handleDeleteNote}
      showActions
      title="This action is permanent."
      okTitle="Delete"
      showCancel
    >
      <Typography className={classes.archiveTitle}>
        {"You're about to delete these notes. Once you do this, you cannot get them back."}
      </Typography>
    </Dialog>
  );
};

export default DeleteNote;
