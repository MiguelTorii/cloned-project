/* eslint-disable jsx-a11y/accessible-emoji */
// @flow

import React from 'react'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
// import directMessageArrow from 'assets/svg/direct-message-arrow.svg'
import useStyles from './_styles/emptyLeftMenu'


const EmptyLeftMenu = ({ isLoading, emptyChannels }) => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      {/* {emptyChannels && <img
        src={directMessageArrow}
        className={classes.arrow}
        alt="direct-message-arrow"
      />} */}
      {emptyChannels && <div className={classes.messageContainer}>
        <Typography
          role="img"
          classes={{
            root: classes.message
          }}
        >
            No one to message yet 😑 <br />
            Click  <Button
            disabled
            variant='contained'
            classes={{
              disabled: classes.newButton
            }}
            color='primary'
          >
            +
          </Button>    to get started!
        </Typography>
        {isLoading && <div className={classes.loading}>
          <CircularProgress />
        </div>}
      </div>}
    </div>
  )
}

export default EmptyLeftMenu
