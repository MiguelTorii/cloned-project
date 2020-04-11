// @flow

import React from 'react'
import EmptyMainChat from 'assets/svg/empty_main_chat.svg'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  messageContainer: {
    position: 'absolute',
    bottom: '35%',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  titleMessage: {
    fontSize: 26,
    color: theme.circleIn.palette.primaryText1,
    marginTop: theme.spacing(),
    textAlign: 'center'
  },
  subtitleMessage: {
    fontSize: 18,
    color: theme.circleIn.palette.primaryText2,
    marginTop: theme.spacing(),
    textAlign: 'center'
  }
}))

const EmptyMain = () => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <div className={classes.messageContainer}>
        <img src={EmptyMainChat} alt='emptychat' />
        <Typography
          classes={{
            root: classes.titleMessage
          }}
        >
          Set up a group class chat
        </Typography>
        <Typography
          classes={{
            root: classes.subtitleMessage
          }}
        >
          Or just chat with a classmate about an issue
        </Typography>
      </div>
    </div>
  )
}

export default EmptyMain
