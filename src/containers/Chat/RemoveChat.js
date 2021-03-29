import React, { useState, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Dialog, { dialogStyle } from 'components/Dialog';
import leaveGroup from 'assets/svg/leave-group.svg'


const useStyles = makeStyles((theme) => ({
  dialog: {
    ...dialogStyle,
    width: 500,
    zIndex: 2100
  },
  blockLabel: {
    color: theme.circleIn.palette.textNormalButton,
    fontWeight: 700
  },
  blockButton: {
    minWidth: 164,
    background: theme.circleIn.palette.danger,
    boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.35)',
    borderRadius: 100
  },
  removeChannel: {
    marginTop: theme.spacing()
  }
}))

const RemoveChat = ({ channel, handleRemoveChannel }) => {
  const classes = useStyles()
  const [removeChat, setRemoveChat] = useState(false)

  const handleRemoveClose = useCallback(() => setRemoveChat(false), [])
  const handleRemoveOpen = useCallback(() => setRemoveChat(true), [])

  const handleRemoveSubmit = useCallback(async () => {
    if (channel) await handleRemoveChannel({ sid: channel.sid })
    handleRemoveClose()
  }, [handleRemoveChannel, channel, handleRemoveClose])


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
        startIcon={<img src={leaveGroup} alt='Leave group' />}
        classes={{
          label: classes.blockLabel,
          root: classes.blockButton
        }}
      >
           Leave Group
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
