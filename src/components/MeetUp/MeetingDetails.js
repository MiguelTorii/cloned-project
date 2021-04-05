import React from 'react'

import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputAdornment from '@material-ui/core/InputAdornment';
import CloseIcon from '@material-ui/icons/Close'

import { ReactComponent as AddUser } from 'assets/svg/add-user.svg'
import { ReactComponent as ClipIcon } from 'assets/svg/clip.svg'

const styles = theme => ({
  meetingDetails: {
    position: 'absolute',
    bottom: 120,
    left: theme.spacing(3),
    maxWidth: 300,
    borderRadius: 20,
    padding: theme.spacing(2)
  },
  header: {
    color: theme.circleIn.palette.white
  },
  description: {
    color: theme.circleIn.palette.white,
    marginTop: theme.spacing()
  },
  inviteMembers: {
    backgroundColor: theme.circleIn.palette.greenInvite,
    border: `1px solid ${theme.circleIn.palette.greenInvite}`,
    boxSizing: 'border-box',
    borderRadius: 10,
    color: theme.circleIn.palette.white,
    '&:hover': {
      backgroundColor: theme.circleIn.palette.greenInvite,
      color: theme.circleIn.palette.white,
    }
  },
  meetingUri: {
    backgroundColor: theme.palette.common.white,
    marginTop: theme.spacing(),
    border: '1px solid #ced4da',
    fontSize: 12,
    borderRadius: 10,
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '& input': {
      padding: theme.spacing(1, 1.5),
      color: theme.circleIn.palette.appBar
    }
  }
})

const MeetingDetails = ({ classes, onClose, onCopy, meetingUri, setRef, openClassmatesDialog }) => {
  return (
    <ClickAwayListener onClickAway={onClose}>
      <Paper elevation={3} className={classes.meetingDetails}>
        <Box display="flex" justifyContent="space-between">
          <Typography component="p" variant="h6" className={classes.header}>
          Study Room Details
          </Typography>
          <IconButton aria-label="delete" onClick={onClose} size="small">
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </Box>
        <Box marginTop={1}>
          <Button
            variant="contained"
            color="primary"
            className={classes.inviteMembers}
            onClick={openClassmatesDialog}
            endIcon={<AddUser />}
          >
          Invite others
          </Button>
        </Box>
        <Typography component="p" variant="body2" className={classes.description}>
        You can invite more to your study room, or share the link below! <span role='img' aria-label='rocket'>🎉</span>
        </Typography>

        <OutlinedInput
          id="meeting-url"
          inputRef={textarea => setRef(textarea)}
          type='text'
          fullWidth
          className={classes.meetingUri}
          value={meetingUri}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={onCopy}
                edge="end"
              >
                <ClipIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </Paper>
    </ClickAwayListener>
  )
}


export default withStyles(styles)(MeetingDetails)
