// @flow

import React, { useState, useMemo, useCallback } from 'react'
import { connect } from 'react-redux'
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import CreateChatChannelDialog from 'components/CreateChatChannelDialog'
import { searchUsers } from 'api/user'
import { addGroupMembers } from 'api/chat'
import { ReactComponent as ChatIcon } from 'assets/svg/community-chat.svg'
import { ReactComponent as ChatStudyRoom } from 'assets/svg/chat-studyroom.svg'
import { ReactComponent as ChatAddMember } from 'assets/svg/chat-addmember.svg'
import { ReactComponent as ChatStudyRoomMemberrs } from 'assets/svg/chat-studyroom-members.svg'
import { ReactComponent as ChatActiveStudyRoomMemberrs } from 'assets/svg/chat-active-studyroom-members.svg'

import useStyles from './_styles/chatHeader'

type Props = {
  channel: Object,
  title: string,
  otherUser: Array,
  rightSpace: number,
  memberKeys: Array,
  videoEnabled: boolean,
  startVideo: Function,
  local: Object,
  user: Object,
  onOpenRightPanel: Function
};

const ChatHeader = ({
  channel,
  title,
  otherUser,
  rightSpace,
  memberKeys,
  videoEnabled,
  startVideo,
  local,
  user,
  onOpenRightPanel
}: Props) => {
  const classes = useStyles()
  const [channelType, setChannelType] = useState(null)
  const [loading, setLoading] = useState(false)

  const { data: { userId, schoolId } } = user

  const members = useMemo(() => channel && local[channel.sid].members, [channel, local])
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

  const onSubmit = useCallback(async ({ selectedUsers }) => {
    setLoading(true)
    try{
      await addGroupMembers({
        chatId: channel.sid,
        users: selectedUsers.map(user => Number(user.userId))
      });
    } finally {
      setLoading(false)
      handleCreateChannelClose()
    }
  }, [channel, handleCreateChannelClose])

  return (
    <div className={classes.header}>
      {channel && <Grid container justify='space-between'>
        <Typography className={classes.headerTitle}>
          <ChatIcon className={classes.headerIcon} /> {title}
        </Typography>
        <div className={classes.chatIcons}>
          {(otherUser?.registered || memberKeys.length > 2) &&
              videoEnabled &&
              <IconButton
                aria-label="study-room"
                className={classes.chatIcon}
                onClick={startVideo}
              >
                <ChatStudyRoom />
              </IconButton>}
          <IconButton
            aria-label="add-member"
            className={classes.chatIcon}
            onClick={handleCreateChannelOpen}
          >
            <ChatAddMember />
          </IconButton>
          {Object.keys(members).length > 2 &&
          <IconButton
            aria-label="studyroom-members"
            className={classes.chatIcon}
            onClick={onOpenRightPanel}
          >
            {rightSpace
              ? <ChatActiveStudyRoomMemberrs />
              : <ChatStudyRoomMemberrs />
            }
          </IconButton>}
        </div>
      </Grid>}
      <CreateChatChannelDialog
        title='ADD CLASSMATES'
        chatType={channelType}
        onClose={handleCreateChannelClose}
        onLoadOptions={handleLoadOptions}
        onSubmit={onSubmit}
        isLoading={loading}
        okLabel='Add Classmates'
      />
    </div>
  )
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatHeader)