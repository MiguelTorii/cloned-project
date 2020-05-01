import React, { useState, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import CreateChatChannelDialog from 'components/CreateChatChannelDialog'
import { searchUsers } from 'api/user'
import { addGroupMembers } from 'api/chat'

const useStyles = makeStyles((theme) => ({
  addLabel: {
    color: theme.circleIn.palette.brand
  },
  addButton: {
    border: `1px solid ${theme.circleIn.palette.brand}`
  },
  addMembers: {
    marginBottom: theme.spacing(1.5)
  }
}))

const AddMembers = ({ updateAvatars, userId, schoolId, channel, members }) => {
  const classes = useStyles()
  const [channelType, setChannelType] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCreateChannelClose = useCallback(() => setChannelType(null), [])
  const handleCreateChannelOpen = useCallback(() => setChannelType('group'), [])

  const handleLoadOptions = useCallback(async ({ query, from }) => {
    if (query.trim() === '' || query.trim().length < 3)
      return {
        options: [],
        hasMore: false
      }

    const users = await searchUsers({
      userId,
      query,
      schoolId: from === 'school' ? Number(schoolId) : undefined
    })

    const memberIds = members.map(m => Number(m.id))

    const options = users.map(user => {
      const name = `${user.firstName} ${user.lastName}`
      const initials =
        name !== '' ? (name.match(/\b(\w)/g) || []).join('') : ''
      return {
        value: user.userId,
        label: name,
        school: user.school,
        grade: user.grade,
        avatar: user.profileImageUrl,
        initials,
        userId: Number(user.userId),
        firstName: user.firstName,
        lastName: user.lastName,
        relationship: user.relationship
      }
    }).filter(o => !memberIds.includes(o.value))
    return {
      options,
      hasMore: false
    }
  }, [userId, schoolId, members])

  const onSubmit = useCallback(async ({selectedUsers}) => {
    setLoading(true)
    try{
      await addGroupMembers({
        chatId: channel.sid,
        users: selectedUsers.map(user => Number(user.userId))
      });
    } finally {
      await updateAvatars()
      setLoading(false)
      handleCreateChannelClose()
    }
  }, [channel, handleCreateChannelClose, updateAvatars])

  return (
    <Grid
      container
      justify='center'
      classes={{
        root: classes.addMembers
      }}
    >
      <Button
        onClick={handleCreateChannelOpen}
        variant='outlined'
        classes={{
          label: classes.addLabel,
          root: classes.addButton
        }}
      >
           Add Member
      </Button>
      <CreateChatChannelDialog
        title='Add Members'
        chatType={channelType}
        onClose={handleCreateChannelClose}
        onLoadOptions={handleLoadOptions}
        onSubmit={onSubmit}
        isLoading={loading}
        okLabel='Add'
      />
    </Grid>
  )
}

export default AddMembers
