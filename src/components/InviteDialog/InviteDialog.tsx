import React from 'react';

import Typography from '@material-ui/core/Typography';

import { useStyles } from '../_styles/InviteDialog';
import Dialog from '../Dialog/Dialog';

const InviteDialog = ({ handleClose, open }) => {
  const classes: any = useStyles();
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
          Send a message on Class Announcements (Canvas, Blackboard, D2L, etc) to tell your
          classmates to also download CircleIn
        </Typography>
      </Dialog>
    </div>
  );
};

export default InviteDialog;
