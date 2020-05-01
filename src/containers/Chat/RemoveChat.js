import React, { useState, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Dialog, { dialogStyle } from 'components/Dialog';


const useStyles = makeStyles((theme) => ({
  dialog: {
    ...dialogStyle,
    width: 500,
    zIndex: 2100
  },
  blockLabel: {
    color: theme.circleIn.palette.danger
  },
  blockButton: {
    border: `1px solid ${theme.circleIn.palette.danger}`
  },
  removeChannel: {
    marginTop: theme.spacing()
  }
}))

const RemoveChat = ({ channel, handleRemoveChannel, clearCurrentChannel }) => {
  const classes = useStyles()
  const [removeChat, setRemoveChat] = useState(false)

  const handleRemoveClose = useCallback(() => setRemoveChat(false), [])
  const handleRemoveOpen = useCallback(() => setRemoveChat(true), [])

  const handleRemoveSubmit = useCallback(async () => {
    if (channel) await handleRemoveChannel({ sid: channel.sid })
    handleRemoveClose()
    clearCurrentChannel()
  }, [handleRemoveChannel, channel, handleRemoveClose, clearCurrentChannel])


  return (
    <Grid
      container
      justify='center'
      classes={{
        root: classes.removeChannel
      }}
    >
      <Button
        onClick={handleRemoveOpen}
        variant='outlined'
        classes={{
          label: classes.blockLabel,
          root: classes.blockButton
        }}
      >
           Remove
      </Button>
      <Dialog
        ariaDescribedBy="remove-dialog-description"
        className={classes.dialog}
        okTitle="Delete"
        onCancel={handleRemoveClose}
        onOk={handleRemoveSubmit}
        open={removeChat}
        showActions
        showCancel
        title="Delete Chat"
      >
        <Typography
          color="textPrimary"
          id="remove-dialog-description"
        >
            Are you sure you want to delete this chat?
          <br />
          <br />
            Deleting this chat can't be undone
        </Typography>
      </Dialog>
    </Grid>
  )
}

export default RemoveChat
