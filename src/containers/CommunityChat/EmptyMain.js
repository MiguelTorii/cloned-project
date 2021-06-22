// @flow

import React from 'react'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import LoadImg from 'components/LoadImg'
// import ExpertEmptyChat from 'assets/svg/expertCommunityEmptyChat.svg'
import ExpertEmptyChat from 'assets/svg/empty_chat.svg'
import EmptyUnregistered from 'assets/svg/emptyCommunityChatUnregistered.svg'
import useStyles from './_styles/emptyMain'

const EmptyMain = ({ newChannel, otherUser, expertMode }) => {
  const classes = useStyles()

  if (otherUser && !otherUser.registered && !newChannel) {
    return (
      <Box
        display='flex'
        alignItems='center'
        justifyContent='center'
        flexDirection='column'
        className={classes.unregisterContainer}
      >
        <LoadImg url={EmptyUnregistered} />
        <Typography className={classes.expertTitle}>
          You don’t have any chats yet, but when you do,
        </Typography>
        <Typography className={classes.expertTitle}>
          your conversations will show up here!
        </Typography>
        <Typography className={classes.expertTitle}>
          The arrow on the left will guide you! &nbsp;
          <span role='img' aria-label='wave'>😊</span>
        </Typography>
      </Box>
    )
  }

  if (expertMode) return (
    <Box
      justifyContent='center'
      alignItems='center'
      display='flex'
      flexDirection='column'
      className={classes.expertContainer}
    >
      <Box
        display='flex'
        alignItems='center'
        justifyContent='center'
        flexDirection='column'
        className={classes.expertContainerText}
      >
        <LoadImg url={ExpertEmptyChat} />
        <Box
          justifyContent='center'
          alignItems='center'
          display='flex'
          flexDirection='column'
        >
          <Typography className={classes.expertTitle}>
            You don’t have any chats yet, but when you do,
          </Typography>
          <Typography className={classes.expertTitle}>
            your conversations will show up here!
          </Typography>
          <Typography className={classes.expertTitle}>
            The arrow on the left will guide you! &nbsp;
            <span role='img' aria-label='wave'>😊</span>
          </Typography>
        </Box>
      </Box>
    </Box>
  )

  return (
    <div className={classes.container}>
      <div className={classes.messageContainer}>
        <LoadImg url={ExpertEmptyChat} className={classes.emptyChatImg} />
        <Box
          justifyContent='center'
          alignItems='center'
          display='flex'
          flexDirection='column'
        >
          <Typography className={classes.expertTitle}>
            You don’t have any conversations started yet,
          </Typography>
          <Typography className={classes.expertTitle}>
            but when you do, they will show up here!
          </Typography>
          <br />
          <Typography className={classes.expertTitle}>
            Click Create New Message to start chatting!
          </Typography>
        </Box>
      </div>
    </div>
  )
}

export default EmptyMain
