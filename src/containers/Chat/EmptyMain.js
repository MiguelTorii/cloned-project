// @flow

import React from 'react'
import EmptyMainChat from 'assets/svg/empty_main_chat.svg'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import LoadImg from 'components/LoadImg'

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  messageContainer: {
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

type Props = {
  noChannel: boolean
};

const EmptyMain = ({noChannel}: Props) => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <div className={classes.messageContainer}>
        <LoadImg url={EmptyMainChat} alt='emptychat' />
        <Typography
          classes={{
            root: classes.titleMessage
          }}
        >
          {!noChannel
            ? 'Time to send a message!'
            : 'Set up a group class chat'}
        </Typography>
        {noChannel && <Typography
          classes={{
            root: classes.subtitleMessage
          }}
        >
          Or just chat with a classmate about an issue
        </Typography>}
      </div>
    </div>
  )
}

export default EmptyMain
