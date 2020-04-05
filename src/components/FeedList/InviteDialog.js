import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'

const InviteDialog = ({ handleClose, open }) => {
  const classes = makeStyles(theme => ({
    actions: {
      margin: theme.spacing(2)
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    content: {
    }
  }))()

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth='sm'
        fullWidth
      >
        <MuiDialogTitle
          disableTypography
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5">Invite Your Classmates</Typography>
          </div>
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </MuiDialogTitle>
        <DialogContent className={classes.content}>
          <Typography>
              Send a message on Class Announcements (Canvas, Blackboard, D2L, etc) to tell your classmates to also download CircleIn
          </Typography>
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button onClick={handleClose} color="primary" variant='contained'>
            Got it!
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default InviteDialog
