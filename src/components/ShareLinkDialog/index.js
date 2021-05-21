import React from 'react'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import useStyles from 'components/_styles/ShareLinkDialog'
import ShareLink from 'components/ShareLinkDialog/ShareLink'
import Dialog from 'components/Dialog'

const ShareLinkDialog = ({
  open,
  channelName,
  handleClose,
  localChannel,
  isGroupChannel
}) => {
  const classes = useStyles()

  return <Dialog
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
        <span role="img" aria-label="Two hands">🙌</span> &nbsp;
        Need to invite a student to this chat? Invite them to your <b>{channelName}</b> {isGroupChannel ? '' : 'group '}chat by sharing the following link.
      </Typography>

      <ShareLink shareLink={localChannel.shareLink} />
    </div>
  </Dialog>

}

export default ShareLinkDialog