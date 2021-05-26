import React, { useCallback, useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import InputBase from '@material-ui/core/InputBase'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import { ReactComponent as ChatSearchIcon } from 'assets/svg/chat-search.svg'
import { getInitials } from 'utils/chat'
import TutorBadge from 'components/TutorBadge'
import Dialog from 'components/Dialog'
import OnlineBadge from 'components/OnlineBadge'
import useStyles from 'components/_styles/RemoveStudentDialog'
import { removeUser, sendMessage } from 'api/chat'
import { logEvent } from 'api/analytics'

const RemoveStudentDialog = ({
  open,
  onClose,
  members,
  channel,
  currentUserName,
  isCommunityChat = false
}) => {
  const classes = useStyles()
  const [search, searchMember] = useState('')
  const [confirmDialog, setConfirmDialog] = useState(false)
  const [user, setUser] = useState(null)

  const handleCloseConfirmModal = useCallback(() => {
    setConfirmDialog(false)
    setUser(null)
  }, [])

  const removeUserFromChannel = useCallback(async() => {
    const messageAttribute = {
      firstName: user.firstname,
      lastName: user.lastname,
      imageKey: 'remove_user'
    }

    const response = await removeUser(user.userId, channel.sid)
    if (response) {
      await sendMessage({
        message: `${currentUserName} removed ${user.firstname} ${user.lastname} from the chat`,
        chatId: channel.sid,
        ...messageAttribute
      })

      logEvent({
        event: 'Chat- Send Message',
        props: { Content: 'Text', 'Channel SID': channel.sid }
      })
    }
    setUser(null)
    setConfirmDialog(false)
  }, [channel, user, currentUserName])

  const removeMember = useCallback(async (member) => {
    if (isCommunityChat) {
      setUser(member)
      setConfirmDialog(true)
      return;
    }
    await removeUser(member.userId, channel.sid)
  }, [channel, isCommunityChat])

  const searchStudentName = useCallback((e) => {
    searchMember(e.target.value)
  }, [])

  return <>
    <Dialog
      open={open}
      title="Remove Student"
      className={classes.dialog}
      hrClass={classes.hrClass}
      onCancel={onClose}
    >
      {isCommunityChat && <Paper component="form" className={classes.searchStudent}>
        <IconButton className={classes.iconButton} aria-label="menu">
          <ChatSearchIcon />
        </IconButton>
        <InputBase
          className={classes.input}
          onChange={searchStudentName}
          placeholder="Search for students"
          inputProps={{ 'aria-label': 'search for students' }}
          value={search}
        />
      </Paper>}
      <List dense className={classes.listRoot}>
        {members.filter(member =>
        `${member.firstname} ${member.lastname}`.includes(search))
          .map(m => {
            const fullName = `${m.firstname} ${m.lastname}`
            return (
              <ListItem
                key={m.userId}
                disableGutters
                button
                classes={{
                  secondaryAction: classes.secondaryAction
                }}
              >
                <ListItemAvatar>
                  <OnlineBadge isOnline={m.isOnline} bgColorPath="circleIn.palette.feedBackground">
                    <Avatar
                      alt={fullName}
                      src={m.image}
                    >
                      {getInitials({ name: fullName })}
                    </Avatar>
                  </OnlineBadge>
                </ListItemAvatar>
                {fullName} {m.role && <TutorBadge text={m.role} />}
                <ListItemSecondaryAction>
                  <Button
                    onClick={() => removeMember(m)}
                    className={classes.removeUser}
                  >
                  Remove
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
      </List>
    </Dialog>
    <Dialog
      open={confirmDialog}
      title={`${user?.firstname} ${user?.lastname}?`}
      className={classes.dialog}
      hrClass={classes.hrClass}
      okButtonClass={classes.okButtonClass}
      closeButtonClass={classes.closeButtonClass}
      onCancel={handleCloseConfirmModal}
      onOk={removeUserFromChannel}
      showActions
      showCancel
      okTitle="Yes, Remove"
      cancelTitle="Cancel"
    >
      <Typography variant="subtitle1">
        Are you sure you want to remove <b>{`${user?.firstname} ${user?.lastname}`}</b>?
        They will be removed from the chat and will no longer have access to it.
      </Typography>
    </Dialog>
  </>
}

export default RemoveStudentDialog