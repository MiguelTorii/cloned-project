// @flow

import React, { useState } from 'react'
import EmptyLeftChat from 'assets/svg/empty_left_chat.svg'
import InviteDialog from 'components/InviteDialog'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import LoadImg from 'components/LoadImg'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  inviteButton: {
    zIndex: 1000,
    position: 'fixed',
    fontWeight: 'bold',
    backgroundColor: '#539f56',
    width: '23%',
    bottom: 10
  },
  messageContainerImg: {
    position: 'absolute',
    bottom: '40%',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  messageContainer: {
    position: 'absolute',
    bottom: '25%',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  message: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: theme.spacing(),
    textAlign: 'center'
  }
}))

const EmptyLeftMenu = ({ emptyChannels }) => {
  const [inviteDialog, setInviteDialog] = useState(false)
  const handleInviteClose = () => setInviteDialog(false)
  const handleInviteOpen = () => setInviteDialog(true)
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <InviteDialog
        handleClose={handleInviteClose}
        open={inviteDialog}
      />
      {emptyChannels && <div className={classes.messageContainerImg}>
        <LoadImg url={EmptyLeftChat} alt='emptychat' />
      </div>}
      {emptyChannels && <div className={classes.messageContainer}>
        <Typography
          classes={{
            root: classes.message
          }}
        >
            Once you send a message about class or a problem, all of your messages will be here
        </Typography>
      </div>}
      <Button
        variant='contained'
        onClick={handleInviteOpen}
        classes={{
          root: classes.inviteButton
        }}
      >
          Invite Classmates
      </Button>
    </div>
  )
}

export default EmptyLeftMenu
