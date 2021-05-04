// @flow
import React, { useState, useEffect, useCallback } from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import GroupIcon from '@material-ui/icons/Group'
import useStyles from './_styles/initialAlert'

type Props = {
  local: Array,
  channel: Object,
  userId: string,
  isCommunityChat: boolean,
  selectedCourse: Object
};

const InitialAlert = ({ local, channel, userId, isCommunityChat, selectedCourse }: Props) => {
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

  const initials = useCallback(name !== ''
    ? (name.match(/\b(\w)/g) || []).join('')
    : '', [name]);

  return isCommunityChat
    ? <Box
      className={classes.root}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Typography className={classes.members} variant="h5">
      Welcome To #{selectedCourse.name}
      </Typography> <br />
      <Typography className={classes.initialAlert} variant="subtitle2">
        {selectedCourse.about}
      </Typography>
    </Box>
    : <Box className={classes.root}>
      <Avatar className={classes.avatarProfile} src={thumbnail}>
        {local[channel.sid].members.length > 2
          ? <GroupIcon />
          : initials
        }
      </Avatar>
      <Typography className={classes.members} variant="h5">{name}</Typography>
      <Typography className={classes.initialAlert} variant="subtitle2">
      This is the beginning of your chat with {isOneToOne ? name : 'your group.'}
      </Typography>
    </Box>
}

export default InitialAlert