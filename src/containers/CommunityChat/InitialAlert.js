/* eslint-disable no-nested-ternary */
// @flow
import React, { useState, useEffect, useMemo } from 'react'
import cx from 'classnames'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import GroupIcon from '@material-ui/icons/Group'
import LoadImg from 'components/LoadImg'
import InitialCommunityImage from 'assets/svg/community_first_time.svg'
import useStyles from './_styles/initialAlert'


type Props = {
  local: Array,
  hasPermission: boolean,
  channel: Object,
  userId: string,
  isCommunityChat: boolean,
  selectedCourse: Object,
  selectedChannel: Object,
  setEnableMessageBox: Function
};

const InitialAlert = ({
  local,
  hasPermission,
  channel,
  userId,
  isCommunityChat,
  selectedCourse,
  selectedChannel,
  setEnableMessageBox
}: Props) => {
  const classes = useStyles()
  const [isOneToOne, setIsOneToOne] = useState(true)
  const [name, setName] = useState('')
  const [thumbnail, setThumbnail] = useState('')

  useEffect(() => {
    if(channel && channel.members) {
      if(local[channel.sid].members.length === 2) {
        local[channel.sid].members.forEach(member => {
          if (Number(member.userId) !== Number(userId)) {
            setName(`${member.firstname} ${member.lastname}`)
            setThumbnail(member.image)
            setIsOneToOne(true)
          }
        })
      } else {
        setThumbnail(local[channel.sid].thumbnail)
        setName(local[channel.sid].title)
        setIsOneToOne(false)
      }
    }
  }, [channel, local, userId])

  const initials = useMemo(() => {
    return name
      ? (name.match(/\b(\w)/g) || []).join('')
      : ''
  }, [name]);

  const initialCourseAvatarName = useMemo(() => {
    return selectedCourse?.name
      ? selectedCourse?.name.substring(0,3).toUpperCase()
      : ''
  }, [selectedCourse]);

  return isCommunityChat
    ? local[channel?.sid]?.twilioChannel.channelState.lastConsumedMessageIndex === null
      ? <Box
        className={classes.root}
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <LoadImg url={InitialCommunityImage} />
        <Typography className={classes.members} variant="h5">
          Welcome To Community Chat
        </Typography>
        {hasPermission
          ? <Typography className={classes.initialAlert} variant="subtitle2">
            Get started with our community template or start customizing
            your community by editing the categories and channels.
          </Typography>
          : <Typography className={classes.initialAlert} variant="subtitle2">
            There’s no activity here yet, but you can get to know <br/>
            your community by sending your first message in<br />
            <b>#{selectedChannel?.chat_name}</b>
          </Typography>
        }
        <Box display="flex" justifyContent="center" alignItems="center" marginTop={3}>
          <Button
            className={classes.initialAlertButton}
            onClick={() => setEnableMessageBox(true)}
          >
            <span role="img" aria-label='message'>💬</span> &nbsp;
            Send Your First Message
          </Button>
        </Box>
      </Box>
      : <Box className={classes.root}>
        <Avatar
          className={cx(classes.avatarProfile, classes.communityChannelProfile)}
          src={thumbnail}
        >
          {initialCourseAvatarName}
        </Avatar>
        <Typography className={classes.members} variant="h5">
          #{selectedChannel?.chat_name}
        </Typography>
        <Typography className={classes.initialAlertDescription} variant="subtitle2">
          This is the beginning of your chat with {isOneToOne ? name : 'your group.'}
        </Typography>
      </Box>
    : <Box className={classes.root}>
      <Avatar className={classes.avatarProfile} src={thumbnail}>
        {local[channel.sid].members.length > 2
          ? <GroupIcon />
          : initials
        }
      </Avatar>
      <Typography className={classes.members} variant="h5">
        {local[channel.sid].members.length === 2 ? `You and ${name}` : name}
      </Typography>
      <Typography className={classes.initialAlertDescription} variant="subtitle2">
        This is the beginning of your chat with {isOneToOne ? name : 'your group.'}
      </Typography>
    </Box>
}

export default InitialAlert