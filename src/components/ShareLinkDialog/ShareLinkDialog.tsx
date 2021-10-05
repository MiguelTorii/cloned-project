import React from 'react';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import useStyles from '../_styles/ShareLinkDialog';
import ShareLink from './ShareLink';
import Dialog from '../Dialog/Dialog';

const ShareLinkDialog = ({ open, handleClose, localChannel }) => {
  const classes: any = useStyles();
  return (
    <Dialog
      className={classes.dialog}
      open={open}
      onCancel={handleClose}
      showHeader={false}
      contentClassName={classes.contentClassName}
      okButtonClass={classes.okButtonClass}
      showActions={false}
    >
      <div className={classes.header}>
        <Typography className={classes.label} variant="h6">
          Share Link
        </Typography>
        <CloseIcon className={classes.closeIcon} onClick={handleClose} />
      </div>

      <div className={classes.content}>
        <Typography variant="body1">
          <span role="img" aria-label="Two hands">
            🙌
          </span>
          &nbsp; Need to invite someone to this chat? Invite them by sharing the following link
        </Typography>

        <ShareLink shareLink={localChannel.shareLink} />
      </div>
    </Dialog>
  );
};

export default ShareLinkDialog;
