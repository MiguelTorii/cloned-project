import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { getInitials, getTitle, fetchAvatars } from 'utils/chat'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import { Link as RouterLink } from 'react-router-dom';
import GroupIcon from '@material-ui/icons/Group';
import Dialog, { dialogStyle } from 'components/Dialog';

const MyLink = React.forwardRef(({ link, ...props }, ref) => {
  return <RouterLink to={link} {...props} ref={ref} />
});

const useStyles = makeStyles((theme) => ({
  dialog: {
    ...dialogStyle,
    width: 500,
    zIndex: 2100
  },
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
  secondaryAction: {
  },
  drawer: {
  },
  drawerOpen: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  videoLabel: {
    fontWeight: 'bold',
    textTransform: 'none'
  },
  videoButton: {
    marginBottom: theme.spacing(2),
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
  blockLabel: {
    color: theme.circleIn.palette.danger
  },
  blockButton: {
    border: `1px solid ${theme.circleIn.palette.danger}`
  }
}))

const RightMenu = ({ userId, channel, handleBlock }) => {
  const classes = useStyles()
  const [title, setTitle] = useState('')
  const [members, setMembers] = useState([])
  const [type, setType] = useState('')
  const [groupImage, setGroupImage] = useState(null)
  const [initials, setInitals] = useState('')
  const [otherUser, setOtherUser] = useState(null)
  const [blockUser, setBlockUser] = useState(false)

  const handleOpenBlock = v => () => setBlockUser(v)

  useEffect(() => {
    const updateAvatars = async () => {
      try {
        const avatars = await fetchAvatars(channel)
        const m = channel.state.attributes.users.map(u => {
          const avatar = avatars.find(a => Number(a.identity) === u.userId)
          if (channel.state.attributes.users.length === 2) {
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
    }

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
    // eslint-disable-next-line
  }, [channel])

  const startVideo = () => window.open(`/video-call/${channel.sid}`, '_blank')
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
          <Button
            variant='contained'
            onClick={startVideo}
            classes={{
              label: classes.videoLabel,
              root: classes.videoButton
            }}
            color='primary'
          >
               Start a Video Call
          </Button>
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
                  key={fullName}
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
        {otherUser && <Grid
          container
          justify='center'
        >
          <Button
            onClick={handleOpenBlock(true)}
            variant='outlined'
            classes={{
              label: classes.blockLabel,
              root: classes.blockButton
            }}
          >
          Block {otherUser.firstName} {otherUser.lastName}
          </Button>
          <Dialog
            ariaDescribedBy="confirm-dialog-description"
            className={classes.dialog}
            okTitle="Yes, I'm sure"
            onCancel={handleOpenBlock(false)}
            onOk={handleBlock(otherUser.userId)}
            open={blockUser}
            showActions
            showCancel
            title="Block User"
          >
            <Typography
              color="textPrimary"
              id="confirm-dialog-description"
            >
              Are you sure you want to block {otherUser.firstName} {otherUser.lastName}
            </Typography>
          </Dialog>
        </Grid>}
      </Grid>
    </Grid>
  )
}

export default RightMenu
