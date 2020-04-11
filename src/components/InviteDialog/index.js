import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Dialog, { dialogStyle } from 'components/Dialog';

const InviteDialog = ({ handleClose, open }) => {
  const classes = makeStyles(() => ({
    dialog: {
      ...dialogStyle,
      width: 600
    }
  }))()

  return (
    <div>
      <Dialog
        className={classes.dialog}
        onClose={handleClose}
        onCancel={handleClose}
        onOk={handleClose}
        open={open}
        showActions
        title="Invite Your Classmates"
      >
        <Typography>
          Send a message on Class Announcements (Canvas, Blackboard, D2L, etc) to tell your classmates to also download CircleIn
        </Typography>
      </Dialog>
    </div>
  );
}

export default InviteDialog
