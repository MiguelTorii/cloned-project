import React, { useCallback, useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { getInitials, getTitle, fetchAvatars } from 'utils/chat'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import { Link as RouterLink } from 'react-router-dom';
import GroupIcon from '@material-ui/icons/Group';
import BlockUser from 'containers/Chat/BlockUser'
import RemoveChat from 'containers/Chat/RemoveChat'
import AddMembers from 'containers/Chat/AddMembers'
import {getGroupMembers} from 'api/chat'

const MyLink = React.forwardRef(({ link, ...props }, ref) => {
  return <RouterLink to={link} {...props} ref={ref} />
});

const useStyles = makeStyles((theme) => ({
  usersContainer: {
    width: '100%',
    padding: theme.spacing(2),
    borderTop: `1px solid ${theme.circleIn.palette.modalBackground}`,
  },
  listRoot: {
    overflow: 'auto',
  },
  header: {
    backgroundColor: theme.circleIn.palette.modalBackground,
    padding: theme.spacing(),
  },
  headerTitle: {
    fontSize: 18,
  },
  title: {
    width: 'inherit',
    textAlign: 'center',
    fontSize: 20,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  container: {
    flexGrow: 1,
    backgroundColor: theme.circleIn.palette.primaryBackground,
  },
  infoContainer: {
    backgroundColor: theme.circleIn.palette.primaryBackground,
    padding: theme.spacing(2),
  },
  usersTitle: {
    padding: theme.spacing()
  },
  icon: {
    fontSize: 14
  },
  avatar: {
    margin: theme.spacing(2),
    height: theme.spacing(10),
    width: theme.spacing(10),
    fontSize: 30
  },
}))

const RightMenu = ({ schoolId, clearCurrentChannel, handleRemoveChannel, userId, channel, handleBlock }) => {
  const classes = useStyles()
  const [title, setTitle] = useState('')
  const [members, setMembers] = useState([])
  const [type, setType] = useState('')
  const [groupImage, setGroupImage] = useState(null)
  const [initials, setInitals] = useState('')
  const [otherUser, setOtherUser] = useState(null)

  const updateAvatars = useCallback(async () => {
    try {
      const avatars = await fetchAvatars(channel)
      const users = await getGroupMembers({ chatId: channel.sid })
      const m = users.map(u => {
        const avatar = avatars.find(a => a.identity === u.userId)
        if (users.length === 2) {
          if (u.userId !== userId) {
            setGroupImage(avatar && avatar.profileImageUrl)
            setInitals(getInitials({name: `${u.firstName} ${u.lastName}`}))
            setOtherUser(u)
          }
        }
        return {
          id: u.userId,
          firstName: u.firstName,
          lastName: u.lastName,
          avatar: avatar && avatar.profileImageUrl
        }
      })
      setMembers(m)
    } catch(e) {}
  }, [userId, channel])

  useEffect(() => {
    const init = async () => {
      try {
        setTitle(getTitle(channel, userId))
      } catch(e) {}
      const { state } = channel
      const { attributes } = state
      const { groupType, thumbnail } = attributes
      if (thumbnail) setGroupImage(thumbnail)
      setType(groupType)
      setTimeout(updateAvatars, 500)
    }

    try {
      setOtherUser(null)
      setMembers([])
      setGroupImage(null)
      setInitals('')
      if (channel) init()
    } catch (e) {}
  }, [channel, userId])

  if (!channel) return null

  return (
    <Grid
      item
      classes={{
        root: classes.container
      }}
    >
      <Grid
        container
        classes={{
          root: classes.container
        }}
        alignItems='flex-start'
      >
        <Grid
          container
          alignItems='flex-start'
          justify='flex-start'
          classes={{
            root: classes.header
          }}
          item
        >
          <Typography className={classes.headerTitle}>Chat Details</Typography>
        </Grid>
        <Grid
          container
          direction='column'
          alignItems='center'
          justify='center'
          classes={{
            root: classes.infoContainer
          }}
        >
          <Typography className={classes.title}>{title}</Typography>
          <Avatar
            src={groupImage}
            alt='group-image'
            className={classes.avatar}
          >
            {initials || <GroupIcon />}
          </Avatar>
          {type && <Typography>Type: {type}</Typography>}
        </Grid>
        <Grid
          classes={{
            root: classes.usersContainer
          }}
        >
          <Typography className={classes.usersTitle}>In this chat...</Typography>
          <List dense className={classes.listRoot}>
            {members.map(m => {
              const fullName = `${m.firstName} ${m.lastName}`
              return (
                <ListItem
                  key={m.id}
                  component={MyLink}
                  link={`/profile/${m.id}`}
                  button
                  classes={{
                    secondaryAction: classes.secondaryAction
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      alt={fullName}
                      src={m.avatar}
                    >
                      {getInitials({name: fullName})}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={fullName} />
                  <ListItemSecondaryAction>
                    <ArrowForwardIosIcon className={classes.icon} />
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </Grid>
        <AddMembers
          userId={userId}
          channel={channel}
          members={members}
          schoolId={schoolId}
          updateAvatars={updateAvatars}
        />
        <BlockUser userId={userId} otherUser={otherUser} handleBlock={handleBlock} />
        <RemoveChat
          clearCurrentChannel={clearCurrentChannel}
          handleRemoveChannel={handleRemoveChannel}
          channel={channel}
        />
      </Grid>
    </Grid>
  )
}

export default React.memo(RightMenu)
